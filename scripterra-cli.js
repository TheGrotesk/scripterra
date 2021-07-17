import commandLineArgs from 'command-line-args';
import fs              from 'fs';
import path            from 'path';

const dir = path.resolve(path.dirname(''), './');

const traitsDir = `${dir}/traits`;
const execDir = `${dir}/executable`;

const createScript = (name) => {
    createFile(`${execDir}/${name}.js`, `${dir}/cli/template.txt`, name);
}

const createTrait = (name) => {
    createFile(`${traitsDir}/${name}.js`, `${dir}/cli/trait_template.txt`, name);
}

const attachTrait = (traits, envs) => {
    for (const trait in traits) {
        for (const env in envs) {
            console.log('Attaching trait ', traits[trait], ' to script ', envs[env]);

            const envExists = fs.existsSync(`${dir}/env/${envs[env]}`);

            if (!envExists) {
                console.error('No such environment like ', envs[env]);
                process.exit(0);
            }

            const traitExists = fs.existsSync(`${traitsDir}/${traits[trait]}`);

            if (!traitExists) {
                console.error('No such trait like ', traits[trait]);
                process.exit(0);
            }

            //TODO: write logic here!!
        }
    }
};

const createFile = (path, templatePath, name) => { 
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

(async () => {
    const defenitions = [
        {name: 'create', alias: 'c', type: Boolean},
        {name: 'script', alias: 's', type: Boolean},
        {name: 'trait',    alias: 't', type: Boolean},
        {name: 'name',   alias: 'n', type: String},
        {name: 'attach_trait', alias: 'a', type: String, multiple: true},
        {name: 'environment', alias: 'e', type: String, multiple: true}
    ];

    const args = commandLineArgs(defenitions);

    if (args['create'] && args['script'] && args['name']) {
        createScript(args['name']);
    } else if (args['create'] && args['trait'] && args['name']){
        createTrait(args['name']);
    } else if (args['attach_trait'] && args['environment']) {
        attachTrait(args['attach_trait'], args['environment']);
    } else {
        console.error('Invalid arguments!');
    }

    process.exit(0);
})();