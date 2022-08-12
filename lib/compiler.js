const babel = require('@babel/core');

module.exports = class Compiler {
  constructor(console, configurator, filesystem) {
    this.console = console;
    this.configurator = configurator;
    this.filesystem = filesystem;
  }

  async compileScriptContent(scriptName) {
    this.console.consoleInfo('Compile script...');

    const workdir = process.cwd();
    const scriptPath = `${workdir}/${this.configurator.config.SCRIPTS_PATH}/${scriptName}`;
    const buildPath = `${workdir}/.build`;

    const scriptContent = this.filesystem.getFileContent(scriptPath);

    const result = babel.transformSync(scriptContent, {
      filename: scriptName,
      presets: ["@babel/preset-env"],
      babelrc: false,
      configFile: false,
    });

    this.filesystem.writeFile(buildPath, scriptName, result.code);
  }
}