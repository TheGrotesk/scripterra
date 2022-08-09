const path = require('path');

const { CREATION_TYPES } = require('./../lib/const/creation-types');

const dir = path.resolve(path.dirname(''), './');
const traitsDir = `${dir}/traits`;
const execDir = `${dir}/executable`;

module.exports = class Processor {
  constructor(console, configurator, filesystem, args) {
    this.console = console;
    this.args = args;
    this.configurator = configurator;
    this.filesystem = filesystem;
  }

  async processCommand() {
    if (this.args['create'] && CREATION_TYPES.includes(this.args['create'])) {
        await this.processCreateCommand();
    } else if (this.args['run']) {
        await this.processRunCommand();
    } else if(this.args['help']) {
        this.console.consoleHelp(defenitions);
    } else {
        this.console.consoleError('No valid arguments provided!');
    }
  } 

  async processCreateCommand() {
    if (!this.args['name'] && this.args['create'] !== CREATION_TYPES[2]) {
      throw new Error('--name is not provided');
    }

    switch (this.args['create']) {
        case CREATION_TYPES[0]: {
            this.createScript(this.args['name'] );
            break;
        }
        case CREATION_TYPES[1]: {
            this.createTrait(this.args['name']);
            break;
        }
        case CREATION_TYPES[2]: {
            this.createConfig();
            break;
        }
    }
  }

  async processRunCommand() {
    if (!this.args['env']) {
        throw new Error('--env is not provided');
    }

    let workdir = process.cwd();

    const script = await require(`${workdir}/${this.configurator.config.SCRIPTS_PATH ?? 'executable'}/${this.args['run']}.js`);

    if (!script) {
        this.console.consoleError(`Script with name ${this.args['run']} not found! Please try another script or create new one.`);
    }

    const Script = new script[this.args['run']](this.args);

    await Script.initTraits();

    await Script.run();
  }

  createScript(name) {
    this.filesystem.createFile(this.configurator.config.SCRIPTS_PATH ?? execDir, `${__dirname}/../cli/template.txt`, name, '.js');
  }

  createTrait(name) {
    this.filesystem.createFile(this.configurator.config.TRAITS_PATH ?? traitsDir, `${__dirname}/../cli/trait_template.txt`, name, '.js');
  }

  createConfig() {
    this.filesystem.createFile('.', `${__dirname}/../cli/config_template.txt`, '.scripterra');
  }
}