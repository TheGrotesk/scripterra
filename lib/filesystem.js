const fs = require('fs');

module.exports = class FileSystem {
  constructor(console) {
    this.console = console;
  }

  createFile(path, templatePath, name, ext = '') {
      const isDirExists = this.checkDir(path);

      if (!isDirExists) {
          this.console.consoleInfo(`Creating directory: ${path}`);
          fs.mkdirSync(path);
      }

      path += `/${name}${ext ?? '.js'}`;

      this.console.consoleInfo(`Path for future file: ${path}`);

      const template = fs.readFileSync(templatePath).toString();

      const resultTemp = template.replace("${name}", name);

      const exists = fs.existsSync(path);

      if (exists) {
          throw new Error('File already exists!');
      } else {
          try {
              fs.writeFileSync(path, resultTemp);

              this.console.consoleInfo('File was created. Enjoy!');
          } catch(err) {
              throw new Error(err.message);
          }
      }
  }

  checkDir(path) {
      return !!fs.existsSync(path);
  }

  getFileContent(path) {
    return fs.readFileSync(path).toString();
  }

  writeFile(path, name, content) {
    if(!this.checkDir(path)) {
      fs.mkdirSync(path);
    }

    return fs.writeFileSync(`${path}/${name}`, content);
  }
}