#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const Compiler = require('../lib/compiler');

const Configurator = require('../lib/configurator');
const Console = require('../lib/console');
const Database = require('../lib/database');
const Schedules = require('../lib/database/entities/schedules');
const Scripts = require('../lib/database/entities/scripts');
const FileSystem = require('../lib/filesystem');
const Processor = require('../lib/processor');
const Scheduler = require('../lib/scheduler');
const Script = require('../lib/script');

const { defenitions } = require('./../lib/defenitions');

const args = commandLineArgs(defenitions);
const isScripterraWorker = true;
const consoleObj = new Console(isScripterraWorker);
const configurator = new Configurator(consoleObj);
const filesystem = new FileSystem(consoleObj);
const compiler = new Compiler(consoleObj, configurator, filesystem);
const database = new Database([
    Scripts,
    Schedules
]);
const scheduler = new Scheduler(consoleObj, filesystem, database);

const processor = new Processor(consoleObj, configurator, filesystem, compiler, database, scheduler, args, isScripterraWorker);

const fs = require('fs');

process.addListener('uncaughtException', (err) => {
    consoleObj.consoleError(err);
});

process.addListener('unhandledRejection', (err) => {
    consoleObj.consoleError(err);
});

(async () => {
    configurator.loadConfig();

    const writeStream = fs.createWriteStream(`${process.cwd()}/${configurator.config.LOG_PATH}/scripterra.pid-${process.pid}.log`);
    process.stdout.write = writeStream.write.bind(writeStream);

    consoleObj.consoleLogo();

    await database.initDb();
    await scheduler.initializeQueue();

    await processor.processSchedulerQueue();
})();
