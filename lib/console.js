const colors = require("colors");
const fs = require('fs');

module.exports = class Console {
    constructor(isScripterraWorker = false) {
        this.isScripterraWorker = isScripterraWorker;
    }

    consoleTime() {
       console.log('[', new Date().toISOString(), ']');
    }

    consoleHelp(defenitions) {
        this.consoleTime();
        this.isScripterraWorker ? console.log('Help |', 'Table of all Scripterra flags:') :
            console.log('Help |'.magenta, 'Table of all Scripterra flags:'.blue);

        this.consoleTable(
            (() => {
                const commands = [];

                for (const command of defenitions) {
                    commands.push({
                        flag: command.name,
                        alias: command.alias,
                        description: command.description
                    });
                }

                return commands;
            })()
        );
    }

    consoleError(err) {
        this.consoleTime();
        this.isScripterraWorker ? console.log('Error |', err) : console.log('Error |'.red, err);
    }

    consoleLogo () {
        this.consoleTime();
        const asciiLogo = fs.readFileSync(`${__dirname}/../cli/logo_ascii`);

        this.isScripterraWorker ? console.log(`${asciiLogo.toString()}`) : console.log(`${asciiLogo.toString()}`.rainbow);
        this.isScripterraWorker ? 
            console.log(`Welcome to Scripterra! Pass --help for more information.\n`) :
            console.log(`Welcome to Scripterra! Pass --help for more information.\n`.cyan);
    }

    consoleWarning(message) {
        this.consoleTime();
        this.isScripterraWorker ? console.log('Warning |', `${message}`) : console.log('Warning |'.yellow, `${message}`.white) ;
    }

    consoleError(message) {
        this.consoleTime();
        this.isScripterraWorker ? console.log('Error | ', `${message}`) :  console.log('Error | '.red, `${message}`.yellow);
    }

    consoleInfo(message) {
        this.consoleTime();
        this.isScripterraWorker ? console.log('Info | ', `${message}`) :  console.log('Info | '.green, `${message}`.blue);
    }

    consoleTable(obj) {
        this.consoleTime();
        console.table(obj);
    }
}