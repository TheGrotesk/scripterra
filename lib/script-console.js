const colors = require("colors");
const fs = require('fs');

module.exports = class ScriptConsole {
  constructor(scriptName, isScripterraWorker = fasle) {
    this.scriptName = scriptName;
    this.isScripterraWorker = isScripterraWorker;
  }

  consoleError(message) {
    !this.isScripterraWorker ? 
      console.log(`[${this.scriptName}]`.yellow,`| Error |`.red, `${message}`.yellow) :
      console.log(`[${this.scriptName}]`,`| Error |`.red, `${message}`);
  }

  consoleInfo(...message) {
    !this.isScripterraWorker ? 
      console.log(`[${this.scriptName}]`.yellow,`| Info |`.green, `${message}`) :
      console.log(`[${this.scriptName}]`,`| Info |`, `${message}`);
  }

  consoleTable(obj) {
    console.log(`[${this.scriptName}] | `);
    console.table(obj);
  }
}