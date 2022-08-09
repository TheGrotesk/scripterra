const path = require('path');

const { CREATION_TYPES } = require('./../lib/const/creation-types');
const { defenitions } = require('./defenitions');
const ScriptConsole = require('./script-console');

const dir = path.resolve(path.dirname(''), './');
module.exports = class Processor {
  constructor(
    console, 
    configurator, 
    filesystem, 
    compiler, 
    database,
    args
  ) {
    this.console = console;
    this.args = args;
    this.configurator = configurator;
    this.filesystem = filesystem;
    this.compiler = compiler;
    this.database = database;
  }

  async processCommand() {
    if (this.args['create'] && CREATION_TYPES.includes(this.args['create'])) {
        await this._processCreate();
    } else if (this.args['run']) {
        await this._processScriptRun();
    } else if (this.args['listall']) {
      await this._processListAll();
    }else if(this.args['help']) {
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
            await this._processCreateScript(this.args['name'] );
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

    const Script = new script[this.args['run']](new ScriptConsole(scriptName), this.args);

    await Script.run();
  }

  async _processCreateScript(name) {
    const path = this.filesystem.createFile(this.configurator.config.SCRIPTS_PATH, `${__dirname}/../cli/template.txt`, name, '.js');

    const scriptEntity = this.database.getEntity('scripts');

    await scriptEntity.insert({
      name,
      path
    });
  }

  _processCreateConfig() {
    this.filesystem.createFile('.', `${__dirname}/../cli/config_template.txt`, '.scripterra');
  }

  async _processListAll() {
    const scriptEntity = this.database.getEntity('scripts');
    
    const list = await scriptEntity.findAll();

    this.console.consoleInfo('List of all available scripts');
    this.console.consoleTable(list);
  }
}