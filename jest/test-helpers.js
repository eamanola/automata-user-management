const { deleteAll, count } = require('automata-db');
const { isVerified, setUnverified, setVerified } = require('automata-email-verification');
const { tableName, findOne, updateOne } = require('../src/lib/model');
const { create: signup, authenticate: login } = require('../src/lib/controllers');

const countUsers = (where) => count(tableName, where);

const findUser = async (where) => findOne(where);

const deleteUsers = () => deleteAll(tableName);

const updateUser = async (where, updates) => updateOne(where, updates);

const setEmailStatus = ({ email, verified }) => (
  verified === true ? setVerified(email) : setUnverified(email)
);

const isEmailVerified = async (email) => isVerified(email);

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await signup({ email, password });
  const { token } = await login({ email, password });
  return token;
};

module.exports = {
  countUsers,
  deleteUsers,
  findUser,
  getToken,
  isEmailVerified,
  setEmailStatus,
  updateUser,
};
