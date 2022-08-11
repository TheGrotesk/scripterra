module.exports = class Scripts {
  constructor(db) {
    this.db = db;
    this.name = 'scripts';
    this.props = [
      {
        name: 'name',
        type: 'TEXT'
      },
      {
        name: 'path',
        type: 'TEXT'
      }
    ];
  }

  async findAll() {
    return this.db.all(`
      SELECT name, path FROM ${this.name}
    `);
  }

  async findOne(name) {
    return this.db.get(`SELECT * FROM ${this.name} where name='${name}'`);
  }

  async delete(name) {
    return this.db.run(`DELETE FROM ${this.name} WHERE name='${name}'`);
  }

  async insert(data) {
    return this.db.run(
      `INSERT INTO ${this.name} (name, path) VALUES (?, ?)`,
      data.name,
      data.path
    );
  }
}