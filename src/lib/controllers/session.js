const crypto = require('node:crypto');

const getSession = (user) => crypto
  .createHash('md5')
  // Other params to invalidate existing tokens?
  .update(`${user.email}${user.passwordHash}`)
  .digest('hex');

const isValidSession = (user, session) => session === getSession(user);

module.exports = {
  getSession,
  isValidSession,
};
