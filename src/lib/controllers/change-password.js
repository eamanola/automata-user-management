const { errors } = require('automata-utils');

const hashPassword = require('../utils/hash-password');
const { updatePasswordHash } = require('../model');

const { paramError } = errors;

const changePassword = async (user, newPassword) => {
  if (!user || !newPassword) {
    throw paramError;
  }

  const passwordHash = await hashPassword(newPassword);

  await updatePasswordHash({ id: user.id }, passwordHash);
};

module.exports = changePassword;
