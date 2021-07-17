#! /usr/bin/env node

import commandLineArgs from 'command-line-args';

(async () => {
    const defenitions = [
        {name: 'name', alias: 'n', type: String},
        {name: 'options', alias: 'o', type: String, multiple: true},
        {name: 'env', alias: 'e', type: String}
    ];

    const args = commandLineArgs(defenitions);

    const script = await import(`./executable/${args.name}.js`);

    if (!script) {
        console.error(`Script with name ${args.name} not found! Please correct name or create new one in executable folder.`);
    }

    const Script = new script[args.name](args);

    await Script.initTraits();
    
    await Script.run();

    process.exit(0);
})();