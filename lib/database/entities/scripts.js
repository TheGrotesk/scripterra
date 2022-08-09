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

  async insert(data) {
    return this.db.run(
      `INSERT INTO ${this.name} (name, path) VALUES (?, ?)`,
      data.name,
      data.path
    );
  }
}