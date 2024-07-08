require('dotenv').config();

const { NODE_ENV, SECRET } = process.env;

module.exports = { NODE_ENV, SECRET };
