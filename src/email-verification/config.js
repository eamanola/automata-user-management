require('dotenv').config({ quiet: true });

const {
  NODE_ENV,
  PORT = 3000,
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
};
