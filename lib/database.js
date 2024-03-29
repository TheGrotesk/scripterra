const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

module.exports = class Database {
  constructor(entities, filesystem) {
    this.entities = entities;
    this.entitiesObjects = [];
    this.filesystem = filesystem;
  }

  async initDb() {
    const dbpath = `${process.cwd()}/scripterra.sqlite`;

    const isDbExists = this.filesystem.checkFile(dbpath);

    if (!isDbExists) {
      this.filesystem.writeFile(process.cwd(), 'scripterra.sqlite', '');
    }

    try {
      this.db = await sqlite.open({
        filename: dbpath,
        driver: sqlite3.Database
      });
  
      this.entities.map(entity => {
        this.entitiesObjects.push(new entity(this.db));
      });

      for(const entity of this.entitiesObjects) {
        const propsStrings = [];
  
        entity.props.map(prop => {
          propsStrings.push(`${prop.name} ${prop.type}`);
        });
        
        await this.db.exec(`
          CREATE TABLE IF NOT EXISTS ${entity.name} (${propsStrings.join(',')})
        `)
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  getEntity(entityName) {
    return this.entitiesObjects.find(entity => entity.name === entityName);
  }
}