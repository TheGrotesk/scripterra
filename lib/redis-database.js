const { Client } = require('redis-om');

module.exports = class RedisDatabase {
  constructor(schemas, configurator) {
    this.schemas = schemas;
    this.configurator = configurator;
  }

  async initDb() {
    this.db = new Client();

    await this.db.open(this.configurator.config.REDIS);
  }

  async getEntity(name) {
    if (!this.schemas[name]) {
      throw new Error('Cant find entity ' + name);
    }

    const repo = this.db.fetchRepository(this.schemas[name]);

    await repo.createIndex();

    return repo;
  }
}