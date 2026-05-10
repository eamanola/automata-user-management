const { randomUUID } = require('node:crypto');

const {
  createTable, findOne, insertOne, updateOne,
} = require('automata-db');

const { NODE_ENV } = require('../../config');
const { passwordHashSchema, userSchema } = require('../validators/user');
const table = require('./table');

let client;

module.exports = {
  findOne: async (where) => findOne(client, table.name, where),
  init: async (db) => {
    if (client) throw new Error('client already exists');

    client = db;
    await createTable(client, table);
  },
  insertOne: async (newUser) => {
    const user = { ...newUser, id: randomUUID() };
    await userSchema.validate(user);

    await insertOne(client, table.name, user);

    return { id: user.id };
  },
  updatePasswordHash: async (where, passwordHash) => {
    await passwordHashSchema.validate(passwordHash);

    return updateOne(client, table.name, where, { passwordHash });
  },
};

if (NODE_ENV === 'test') {
  module.exports.tableName = table.name;
  module.exports.updateOne = async (where, updates) => (
    updateOne(client, table.name, where, updates)
  );
}
