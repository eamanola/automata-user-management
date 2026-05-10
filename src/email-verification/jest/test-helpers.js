const { deleteAll } = require('automata-db');

const { name: tableName } = require('../lib/model/table');
const { isVerified, setUnverified, setVerified } = require('../lib/controllers/set-status');

const createUser = async ({ email = 'foo@example.com' } = {}) => {
  const code = await setUnverified(email);
  return { code, email };
};

module.exports = {
  createUser,
  deleteAll: (db) => deleteAll(db, tableName),
  isVerified,
  setUnverified,
  setVerified,
};
