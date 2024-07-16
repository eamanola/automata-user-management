const bcrypt = require('bcrypt');

const saltRounds = 11;

const hashPassword = async (password) => bcrypt.hash(password, saltRounds);

module.exports = hashPassword;
