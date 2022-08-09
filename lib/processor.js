const path = require('path');

const { CREATION_TYPES } = require('./../lib/const/creation-types');
const { defenitions } = require('./defenitions');

const dir = path.resolve(path.dirname(''), './');
module.exports = class Processor {
  constructor(console, configurator, filesystem, compiler, args) {
    this.console = console;
    this.args = args;
    this.configurator = configurator;
    this.filesystem = filesystem;
    this.compiler = compiler;
  }

  async processCommand() {
    if (this.args['create'] && CREATION_TYPES.includes(this.args['create'])) {
        await this._processCreate();
    } else if (this.args['run']) {
        await this._processScriptRun();
    } else if(this.args['help']) {
        this.console.consoleHelp(defenitions);
    } else {
        this.console.consoleError('No valid arguments provided!');
    }
  } 

  async _processCreate() {
    if (!this.args['name'] && this.args['create'] !== CREATION_TYPES[2]) {
      throw new Error('--name is not provided');
    }

    switch (this.args['create']) {
        case CREATION_TYPES[0]: {
            this._processCreateScript(this.args['name'] );
            break;
        }
        case CREATION_TYPES[2]: {
            this._processCreateConfig();
            break;
        }
    }
  }

  async _processScriptRun() {
    if (!this.args['env']) {
        throw new Error('--env is not provided');
    }

    let workdir = process.cwd();
    const scriptName = `${this.args['run']}.js`;

    await this.compiler.compileScriptContent(scriptName);

    const script = await require(`${workdir}/.build/${scriptName}`);

    if (!script) {
        this.console.consoleError(`Script with name ${this.args['run']} not found! Please try another script or create new one.`);
    }

    const Script = new script[this.args['run']](this.console, this.args);

    await Script.run();
  }

  _processCreateScript(name) {
    this.filesystem.createFile(this.configurator.config.SCRIPTS_PATH, `${__dirname}/../cli/template.txt`, name, '.js');
  }

  _processCreateConfig() {
    this.filesystem.createFile('.', `${__dirname}/../cli/config_template.txt`, '.scripterra');
  }
}