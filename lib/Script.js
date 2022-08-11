module.exports = class Script {
    constructor(console, args) {
        this.console = console;
        this.args = args;
        this.name = args.run;

        delete args.run;
    }

    async run() {
        try {
            await Promise.all([
                this.console.consoleInfo(`Starting...`),
                this.main(this.args),
                this.console.consoleInfo(`Finished.`)
            ]);
        } catch(error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}