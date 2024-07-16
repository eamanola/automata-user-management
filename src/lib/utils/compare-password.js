const bcrypt = require('bcrypt');

const comparePassword = async (password, hashed) => bcrypt.compare(password, hashed);

module.exports = comparePassword;
