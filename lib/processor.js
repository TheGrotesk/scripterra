const path = require('path');
const dotenv = require('dotenv');

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
    scheduler,
    args
  ) {
    this.console = console;
    this.args = args;
    this.configurator = configurator;
    this.filesystem = filesystem;
    this.compiler = compiler;
    this.database = database;
    this.scheduler = scheduler;
  }

  async processCommand() {
    if (this.args['create'] && CREATION_TYPES.includes(this.args['create'])) {
        await this._processCreate();
    } else if (this.args['run']) {
        await this._processScriptRun(this.args['env'], this.args['run']);
    } else if(this.args['schedule']){
        await this._processSchedule(this.args['schedule'], this.args['env'], this.args['expression']);
    } else if (this.args['listall']) {
      await this._processListAll();
    } else if (this.args['start-worker']) {
      await this.processSchedulerQueue();
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
            await this._processCreateScript(this.args['name'] );
            break;
        }
        case CREATION_TYPES[2]: {
            this._processCreateConfig();
            break;
        }
    }
  }

  async _processScriptRun(env, name) {
    if (!env) {
        throw new Error('--env is not provided');
    }

    let workdir = process.cwd();
    const scriptName = `${name}.js`;

    await this.compiler.compileScriptContent(scriptName);

    const modulePath = `${workdir}/.build/${scriptName}`;

    delete require.cache[require.resolve(modulePath)];

    const script = await require(modulePath);

    if (!script) {
        this.console.consoleError(`Script with name ${name} not found! Please try another script or create new one.`);
    }

    const Script = new script[name](new ScriptConsole(scriptName), this.args);

    dotenv.config({path: `${workdir}/${this.configurator.config.ENV_PATH}/${env}`})

    await Script.run();
  }

  async _processSchedule(name, env, expression) {
    if (!env) {
      throw new Error('--env is not provided');
    }

    if (!expression) {
      throw new Error('--expression is not provided');
    }

    await this.scheduler.schedule(name, env, expression);
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

  async processSchedulerQueue() {
    this.console.consoleInfo('Starting schedules worker...');

    const scheduleEntity = this.database.getEntity('schedules');

    const schedules = await scheduleEntity.findAll();

    if (!schedules.length) {
      this.console.consoleInfo('No schedules found. Skipping this part..');
      return;
    }

    for (const schedule of schedules) {
      await this.scheduler.queue.process(schedule.script, async (job) => {
        await this._processScriptRun(schedule.env, schedule.script);
      });
    }
  }
}