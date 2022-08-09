const dotenv = require('dotenv');

module.exports = class Configurator {
  constructor(console) {
    this.console = console;
    this.config = {};
  }

  loadConfig() {
      const result = dotenv.config({
          path: './.scripterra'
      });

      if (result.error) {
          this.console.consoleInfo(`Can't load Scripterra config file! Please create .scripterra file or check it for existing.`);
      } else {
          this.console.consoleInfo('Current .scripterra config:');
          this.console.consoleTable(result.parsed);

          this.config = result.parsed;
      }
  }
}