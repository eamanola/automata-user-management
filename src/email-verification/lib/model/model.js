const table = require('./table');
const validator = require('./validator');

const model = {
  db: null,
  findOne: async (email) => this.db.findOne(table.name, { email }),
  init: async (db) => {
    if (this.db) throw new Error('client already exists');

    this.db = db;

    return this.db.createTable(table);
  },
  insertOne: async (email, code) => {
    await validator.validate({ code, email });

    return this.db.insertOne(table.name, { code, email });
  },
  updateOne: async (email, code) => this.db.updateOne(table.name, { email }, { code }),
};

module.exports = model;
