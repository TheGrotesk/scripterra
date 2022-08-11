const colors = require("colors");
const fs = require('fs');

module.exports = class ScriptConsole {
  constructor(scriptName) {
    this.scriptName = scriptName;
  }

  consoleError(message) {
      console.log(`[${this.scriptName}]`.yellow,`| Error |`.red, `${message}`.yellow);
  }

  consoleInfo(...message) {
      console.log(`[${this.scriptName}]`.yellow,`| Info |`.green, `${message}`);
  }

  consoleTable(obj) {
    console.log(`[${this.scriptName}] | `);
    console.table(obj);
  }
}