const { deleteAll, count } = require('automata-db');
const { isVerified, setUnverified, setVerified } = require('automata-email-verification');
const userModel = require('../src/lib/model');
const userControllers = require('../src/lib/controllers');

const countUsers = (where) => count(userModel.tableName, where);

const findUser = async (where) => userModel.findOne(where);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await userControllers.create({ email, password });

  return findUser({ email });
};

const deleteUsers = () => deleteAll(userModel.tableName);

const updateUser = async (where, updates) => userModel.updateOne(where, updates);

const setEmailStatus = ({ email, verified }) => (verified === true
  ? setVerified(email)
  : setUnverified(email));

const isEmailVerified = async (email) => isVerified(email);

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  const { token } = await userControllers.authenticate({ email, password });
  return { token, user };
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
