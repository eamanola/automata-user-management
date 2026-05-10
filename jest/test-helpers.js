const { deleteAll, count } = require('automata-db');

const { tableName, findOne, updateOne } = require('../src/lib/model');
const { create: signup, authenticate } = require('../src/lib/controllers');
const { isVerified, setUnverified, setVerified } = require('../src/email-verification');

const countUsers = (db, where) => count(db, tableName, where);

const findUser = async (where) => findOne(where);

const deleteUsers = (db) => deleteAll(db, tableName);

const updateUser = async (where, updates) => updateOne(where, updates);

const setEmailStatus = ({ email, verified }) => (
  verified === true ? setVerified(email) : setUnverified(email)
);

const isEmailVerified = async (email) => isVerified(email);

const tokenCreator = ({ SECRET }) => {
  const login = authenticate({ SECRET });

  return async ({ email = 'foo@example.com', password = '123' } = {}) => {
    await signup({ email, password });
    const { token } = await login({ email, password });
    return token;
  };
};

module.exports = {
  countUsers,
  deleteUsers,
  findUser,
  isEmailVerified,
  setEmailStatus,
  tokenCreator,
  updateUser,
};
