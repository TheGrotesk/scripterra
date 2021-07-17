#! /usr/bin/env node

import commandLineArgs from 'command-line-args';
import fs              from 'fs';
import path            from 'path';
import pkg             from './../package.json';

const dir = path.resolve(path.dirname(''), './');

const traitsDir = `${dir}/traits`;
const execDir = `${dir}/executable`;

(async () => {
    console.table(['Scripterra', pkg.version]);
    const CREATION_TYPES = ['script', 'trait'];

    const defenitions = [
        {name: 'create', alias: 'c', type: String},
        {name: 'name',   alias: 'n', type: String},
        {name: 'run', alias: 'r', type: String},
        {name: 'env', alias: 'e', type: String}
    ];

    const args = commandLineArgs(defenitions);

    if (args['create'] && CREATION_TYPES.includes(args['create'][0])) {
        if (!args['name']) {
            console.log('--name is not provided');
            process.exit(0);
        }

        switch (args['create'][0]) {
            case CREATION_TYPES[0]: {
                createScript(args['name'] );
                break;
            }
            case CREATION_TYPES[1]: {
                createTrait(args['name']);
                break;
            }
        }
    } else if (args['run']) {
        if (!args['env']) {
            console.log('--env is not provided');
            process.exit(0);
        }

        const script = await import(`./executable/${args['run']}.js`);

        if (!script) {
            console.error(`Script with name ${args['run']} not found! Please try another script or create new one.`);
        }

        const Script = new script[args['run']](args);

        await Script.initTraits();

        await Script.run();
    } else {
        console.error('Invalid arguments!');
    }

    process.exit(0);
})();

function createScript(name) {
    createFile(`${execDir}/${name}.js`, `${dir}/cli/template.txt`, name);
}

function createTrait(name) {
    createFile(`${traitsDir}/${name}.js`, `${dir}/cli/trait_template.txt`, name);
}

function createFile(path, templatePath, name) {
    const template = fs.readFileSync(templatePath).toString();

    const resultTemp = template.replace("${name}", name);

    const exists = fs.existsSync(path);

    if (exists) {
        console.error('File already exists!');
        process.exit(0);
    } else {
        try {
            fs.writeFileSync(path, resultTemp);

            console.log('File was created. Enjoy!');
        } catch(err) {
            console.log(err);
            process.exit(0);
        }
    }
}