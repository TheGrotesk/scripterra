#! /usr/bin/env node

const commandLineArgs = require('command-line-args');

const Configurator = require('../lib/configurator');
const Console = require('../lib/console');
const FileSystem = require('../lib/filesystem');
const Processor = require('../lib/processor');

const { defenitions } = require('./../lib/defenitions');

const args = commandLineArgs(defenitions);

const consoleObj = new Console();
const configurator = new Configurator(consoleObj);
const filesystem = new FileSystem(consoleObj);
const processor = new Processor(consoleObj, configurator, filesystem, args);

process.addListener('uncaughtException', (err) => {
    consoleObj.consoleError(err);
});

process.addListener('unhandledRejection', (err) => {
    consoleObj.consoleError(err);
});

(async () => {
    consoleObj.consoleLogo();
    configurator.loadConfig();
    await processor.processCommand();

    process.exit(0);
})();