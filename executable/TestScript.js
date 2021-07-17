import Script from './../lib/Script.js';

export class TestScript extends Script {
    constructor(args) {
        super(args);
    }

    async main() {
        await this.logger.info('Hello!');
    }
}