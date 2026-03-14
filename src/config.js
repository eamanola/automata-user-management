require('dotenv').config({ quiet: true });

const { NODE_ENV, SECRET } = process.env;

module.exports = { NODE_ENV, SECRET };
