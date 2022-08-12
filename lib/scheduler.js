const cron = require('node-cron');
const bull = require('bull');
const { exec } = require('child_process');

module.exports = class Scheduler {
  constructor(console, filesystem, database) {
    this.console = console;
    this.filesystem = filesystem;
    this.database = database;
  }

  async initializeQueue() {
    this.queue = new bull('scripterra-scheduler', process.env.REDIS);
  }

  async scheduleV2(scriptName, env, cronExpression) {
    const isValidExpression = cron.validate(cronExpression);

    if (!isValidExpression) {
      throw new Error('Invalid cron expression!');
    }

    const scriptEntity = await this.database.getEntity('Scripts');

    const script = await scriptEntity.search().where('name').equals(scriptName).return.first();

    if (!script) {
      throw new Error(`Script not found. Type: scripterra --create script --name ${scriptName}`)
    }

    const schedulesEntity = await this.database.getEntity('Schedules');

    const schedule = await schedulesEntity.search()
      .where('script').equals(scriptName)
      .where('env').equals(env)
      .return.first();

      console.log(schedule);

    if (!schedule) {
      this.console.consoleInfo('Creating the schedule..');
  
      await schedulesEntity.createAndSave({
          script: scriptName,
          env,
          expression: cronExpression
      });
  
      await this.queue.add(scriptName, {
        env,
        scriptName
      }, 
      { 
        repeat: { 
          cron: cronExpression 
        } 
      });
  
      return;
    }

    this.console.consoleWarning('This script and env already scheduled. Updating schedule...');

    schedule.script = scriptName;
    schedule.env = env;
    schedule.expression = cronExpression;

    await schedulesEntity.save(schedule);

    this.queue.removeJobs(scriptName);

    await this.queue.add(scriptName, {
      env,
      scriptName
    }, 
    { 
      repeat: { 
        cron: cronExpression 
      } 
    });
  }

  async schedule(scriptName, env, cronExpression) {
    const isValidExpression = cron.validate(cronExpression);

    if (!isValidExpression) {
      throw new Error('Invalid cron expression!');
    }

    const scriptsEntity = this.database.getEntity('scripts');

    const script = await scriptsEntity.findOne(scriptName);

    if (!script) {
      throw new Error(`Script not found. Type: scripterra --create script --name ${scriptName}`)
    }

    const schedulesEntity = this.database.getEntity('schedules');

    const schedule = await schedulesEntity.findOneByScriptAndEnv(scriptName, env);

    if (!schedule) {
      this.console.consoleInfo('Creating the schedule..');

      await schedulesEntity.insert({
        script: scriptName,
        env,
        expression: cronExpression
      });

      await this.queue.add(scriptName, {
        env,
        scriptName
      }, 
      { 
        repeat: { 
          cron: cronExpression 
        } 
      });

      return;
    }

    this.console.consoleWarning('This script and env already scheduled. Updating schedule...');

    await schedulesEntity.updateByScriptAndEnv(scriptName, env, cronExpression);
    this.queue.removeJobs(scriptName);

    await this.queue.add(scriptName, {
      env,
      scriptName
    }, 
    { 
      repeat: { 
        cron: cronExpression 
      } 
    });
  }
}