const {
  createTable,
  findOne,
  insertOne,
  updateOne,
} = require('automata-db');

const table = require('./table');
const validator = require('./validator');

let client;
// createTable(table);

const model = {
  findOne: async (email) => findOne(client, table.name, { email }),
  init: async (db) => {
    if (client) throw new Error('client already exists');

    client = db;
    return createTable(client, table);
  },
  insertOne: async (email, code) => {
    await validator.validate({ code, email });

    return insertOne(client, table.name, { code, email });
  },
  updateOne: async (email, code) => updateOne(client, table.name, { email }, { code }),
};

module.exports = model;
