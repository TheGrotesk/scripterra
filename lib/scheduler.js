const cron = require('node-cron');

module.exports = class Scheduler {
  constructor(console, filesystem, database) {
    this.console = console;
    this.filesystem = filesystem;
    this.database = database;
  }

  schedule(callback, cronExpression) {
    cron.schedule(cronExpression, callback);
  }
}