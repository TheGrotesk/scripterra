const path = require('path');
const dotenv = require('dotenv');

// const dirname = path.resolve();

module.exports = class Script {
    constructor(console, args) {
        // dotenv.config({ path: `${dirname}/env/${args.env}` });
        this.console = console;
        this.args = args;
        this.name = args.name;

        delete args.name;
    }

    async run() {
        try {
            await Promise.all([
                this.console.consoleInfo(`Starting script ${this.name}...`),
                this.main(this.args)
            ]);
        } catch(error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}