const { randomUUID } = require('node:crypto');

const { passwordHashSchema, userSchema } = require('../validators/user');
const table = require('./table');

module.exports = {
  db: null,
  findOne: async (where) => this.db.findOne(table.name, where),
  init: async (db) => {
    if (this.db) throw new Error('client already exists');

    this.db = db;
    await this.db.createTable(table);
  },
  insertOne: async (newUser) => {
    const user = { ...newUser, id: randomUUID() };
    await userSchema.validate(user);

    await this.db.insertOne(table.name, user);

    return { id: user.id };
  },
  updatePasswordHash: async (where, passwordHash) => {
    await passwordHashSchema.validate(passwordHash);

    return this.db.updateOne(table.name, where, { passwordHash });
  },
};
