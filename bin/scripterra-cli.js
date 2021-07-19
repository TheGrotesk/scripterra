#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const colors = require("colors");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const babel = require('@babel/core');

const dir = path.resolve(path.dirname(''), './');

const traitsDir = `${dir}/traits`;
const execDir = `${dir}/executable`;

const CREATION_TYPES = ['script', 'trait', 'config'];
const defenitions = [
    {name: 'create', alias: 'c', type: String, description: 'Starts the process of creating a script or trait. Possible values (script | trait | config)'},
    {name: 'name',   alias: 'n', type: String, description: 'Specifies the name of the script or trait when using the --create flag'},
    {name: 'run', alias: 'r', type: String},
    {name: 'env', alias: 'e', type: String},
    {name: 'list', alias: 'l', type: Boolean, description: 'Get list of all created scripts'},
    {name: 'help', type: Boolean}
];

let config;

(async () => {
    consoleLogo();
    loadConfig();

    const args = commandLineArgs(defenitions);

    await runCommand(args);

    process.exit(0);
})();

async function runCommand (args) {
    const scriptDir = config.SCRIPTS_PATH ?? execDir;

    if (args['create'] && CREATION_TYPES.includes(args['create'])) {
        if (!args['name'] && args['create'] !== CREATION_TYPES[2]) {
            consoleError('--name is not provided');
            process.exit(0);
        }

        switch (args['create']) {
            case CREATION_TYPES[0]: {
                createScript(args['name'] );
                break;
            }
            case CREATION_TYPES[1]: {
                createTrait(args['name']);
                break;
            }
            case CREATION_TYPES[2]: {
                createConfig();
                break;
            }
        }
    } else if (args['run']) {
        if (!args['env']) {
            consoleError('--env is not provided');
            process.exit(0);
        }

        const scriptPath = `${scriptDir}/${args['run']}`;

        const es5BuildResult = await buildScript(scriptPath, args['run']);

        try {
            fs.writeFileSync(`${scriptDir}/${args['run']}.build.js`, es5BuildResult.code);
        } catch (err) {
            consoleError(err.message);
        }

        const script = (require(`${path.resolve()}/${scriptDir}/${args['run']}.build.js`)).default;

        if (!script) {
            consoleError(`Script with name ${args['run']} not found! Please try another script or create new one.`);
        }

        console.log(script);

        const Script = new script(config, args);

        await Script.initTraits();

        await Script.run();
    } else if(args['help']) {
        consoleHelp(defenitions);
    } else if (args['list']) {
        consoleInfo(`List of all created scripts in ${scriptDir}:`);
        consoleListOfAllScripts(scriptDir);
    } else {
        consoleError('No valid arguments provided!');
    }
}


function createScript(name) {
    createFile(config.SCRIPTS_PATH ?? execDir, `${__dirname}/../cli/template.txt`, name, '.js');
}

function createTrait(name) {
    createFile(config.TRAITS_PATH ?? traitsDir, `${__dirname}/../cli/trait_template.txt`, name, '.js');
}

function createConfig() {
    createFile('.', `${__dirname}/../cli/config_template.txt`, '.scripterra');
}

function createFile(path, templatePath, name, ext = '') {
    const isDirExists = checkDir(path);

    if (!isDirExists) {
        consoleInfo(`Creating directory: ${path}`);
        fs.mkdirSync(path);
    }

    path += `/${name}${ext ?? '.js'}`;
    consoleInfo(`Path for future file: ${path}`);

    const template = fs.readFileSync(templatePath).toString();

    const resultTemp = template.replace("${name}", name);

    const exists = fs.existsSync(path);

    if (exists) {
        consoleError('File already exists!');
        process.exit(0);
    } else {
        try {
            fs.writeFileSync(path, resultTemp);

            consoleInfo('File was created. Enjoy!');
        } catch(err) {
            consoleError(err);
            process.exit(0);
        }
    }
}

function checkDir(path) {
    return !!fs.existsSync(path);
}

function consoleLogo () {
    const asciiLogo = fs.readFileSync(`${__dirname}/../cli/logo_ascii`);

    console.log(`${asciiLogo.toString()}`.rainbow);
    console.log(`Welcome to Scripterra! Pass --help for more information.\n`.cyan);
}

function consoleError(message) {
    console.log('Error | '.red, `${message}`.yellow);
}

function consoleInfo(message) {
    console.log('Info | '.green, `${message}`.blue);
}

function consoleTable(obj) {
    console.table(obj);
}

function consoleHelp(defenitions) {
    console.log('Help | '.magenta, 'Table of all Scripterra flags:'.blue);
    consoleTable(
        (() => {
            const commands = [];

            for (const command of defenitions) {
                commands.push({
                    flag: command.name,
                    alias: command.alias,
                    description: command.description
                });
            }

            return commands;
        })()
    );
    console.log('Documentation: https://github.com/TheGrotesk/scripterra/tree/master/public/docs'.yellow);
}

function consoleListOfAllScripts(path) {
    const scripts = fs.readdirSync(path);
    consoleTable((() => scripts.map(script => {
        return {
            name: script,
            status: ''
        }
    }))());
}

function loadConfig() {
    const result = dotenv.config({
        path: './.scripterra'
    });

    if (result.error) {
        consoleInfo(`Can't load Scripterra config file! Please create .scripterra file or check it for existing.`);
    } else {
        consoleInfo('Current .scripterra config:');
        consoleTable(result.parsed);

        config = result.parsed;
    }
}

function buildScript(path, name) {
    consoleInfo(`Starting building the script...${path}`);

    const buildResult = babel.transformFileSync(path + '.js', {
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": false
            }]
        ],
        "plugins": ['@babel/plugin-transform-runtime']
    });

    if (!buildResult) {
        consoleError(buildResult);
    }

    consoleInfo('Script successfully build!');

    return buildResult;
}