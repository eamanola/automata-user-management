const { name: tableName } = require('../src/lib/model/table');
const { create: signup, authenticate } = require('../src/lib/controllers');
const { isVerified, setUnverified, setVerified } = require('../src/email-verification');

const countUsers = (db, where) => db.count(tableName, where);

const findUser = async (db, where) => db.findOne(tableName, where);

const deleteUsers = (db) => db.deleteAll(tableName);

const updateUser = async (db, where, updates) => db.updateOne(tableName, where, updates);

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
