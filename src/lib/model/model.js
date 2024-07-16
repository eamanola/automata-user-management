const { randomUUID } = require('node:crypto');
const {
  createTable, findOne, insertOne, updateOne,
} = require('automata-db');

const { NODE_ENV } = require('../../config');

const userSchema = require('../validators/user');

const table = require('./table');

// name to avoid dublicates
const createUsersTable = async () => createTable(table);
createUsersTable();

module.exports = {
  findOne: async (where) => findOne(table.name, where),
  insertOne: async (newUser) => {
    const user = { ...newUser, id: randomUUID() };
    await userSchema.validate(user);

    await insertOne(table.name, user);

    return { id: user.id };
  },
};

if (NODE_ENV === 'test') {
  module.exports.tableName = table.name;
  module.exports.updateOne = async (where, updates) => updateOne(table.name, where, updates);
}
