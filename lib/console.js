const colors = require("colors");
const fs = require('fs');

module.exports = class Console {
  consoleHelp(defenitions) {
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
      console.log('Error |'.red, err);
  }

  consoleLogo () {
      const asciiLogo = fs.readFileSync(`${__dirname}/../cli/logo_ascii`);

      console.log(`${asciiLogo.toString()}`.rainbow);
      console.log(`Welcome to Scripterra! Pass --help for more information.\n`.cyan);
  }

  consoleWarning(message) {
    console.log('Warning |'.yellow, `${message}`.white);
  }

  consoleError(message) {
      console.log('Error | '.red, `${message}`.yellow);
  }

  consoleInfo(message) {
      console.log('Info | '.green, `${message}`.blue);
  }

  consoleTable(obj) {
      console.table(obj);
  }
}