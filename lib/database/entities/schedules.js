module.exports = class Schedules {
  constructor(db) {
    this.db = db;
    this.name = 'schedules';
    this.props = [
      {
        name: 'script',
        type: 'TEXT'
      },
      {
        name: 'env',
        type: 'TEXT'
      },
      {
        name: 'expression',
        type: 'TEXT'
      },
      {
        name: 'serialized_task',
        type: 'TEXT'
      }
    ];
  }

  async findAll() {
    return this.db.all(`
      SELECT script, env, expression, serialized_task FROM ${this.name}
    `);
  }

  async findOneByScriptAndEnv(script, env) {
    return this.db.get(`SELECT * FROM ${this.name} WHERE script='${script}' AND env='${env}'`);
  }

  async insert(data) {
    return this.db.run(
      `INSERT INTO ${this.name} (script, env, expression, serialized_task) VALUES (?, ?, ?, ?)`,
      data.script,
      data.env,
      data.expression,
      ''
    );
  }

  async updateByScriptAndEnv(script, env, expression) {
    return this.db.run(
      `UPDATE ${this.name} SET script='${script}', env='${env}', expression='${expression}' WHERE script='${script}' AND env='${env}'`
    );
  }
}