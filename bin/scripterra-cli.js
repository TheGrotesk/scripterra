#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const colors = require("colors");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(path.dirname(''), './');

const traitsDir = `${dir}/traits`;
const execDir = `${dir}/executable`;

let config;

(async () => {
    consoleLogo();
    loadConfig();

    const CREATION_TYPES = ['script', 'trait', 'config'];

    const defenitions = [
        {name: 'create', alias: 'c', type: String},
        {name: 'name',   alias: 'n', type: String},
        {name: 'run', alias: 'r', type: String},
        {name: 'env', alias: 'e', type: String}
    ];

    const args = commandLineArgs(defenitions);

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

        const script = await import(`./${config.SCRIPTS_PATH ?? 'executable'}/${args['run']}.js`);

        if (!script) {
            consoleError(`Script with name ${args['run']} not found! Please try another script or create new one.`);
        }

        const Script = new script[args['run']](args);

        await Script.initTraits();

        await Script.run();
    } else {
        consoleError('No valid arguments provided!');
    }

    process.exit(0);
})();

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