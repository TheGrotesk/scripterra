import path from 'path';
import dotenv from 'dotenv';

const dirname = path.resolve();

export default class Script {
    constructor(args) {
        dotenv.config({ path: `${dirname}/env/${args.env}` });
        
        this.args = args;
        this.name = args.name;

        delete args.name;
    }

    async initTraits() {
        this.traits = {};

        let traits = process.env.TRAITS;

        const arrayOfTraitsNames = traits.split(",");

        await Promise.all(arrayOfTraitsNames.map(async function (val){
            val = val.trim();
            const trait = await import(`./traits/${val}.js`);
            const object = new trait[val]();
            
            await object.init();

            this.traits[val] = object;
        }.bind(this)));
    }

    async run() {
        try {
            await Promise.all([
                this.logger.info(`Starting script ${this.name}...`),
                this.main(this.args)
            ]);
        } catch(error) {
            console.log('Error!', error);
            await this.logger.error(`Error! ${error}`);
        }
    }
}