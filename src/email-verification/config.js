require('dotenv').config({ quiet: true });

const {
  PORT = 3000,
} = process.env;

module.exports = {
  PORT,
};
