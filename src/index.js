const { NODE_ENV } = require('./config');
const controllers = require('./lib/controllers');
const model = require('./lib/model');
const router = require('./lib/router');

module.exports = { router };

if (NODE_ENV === 'test') {
  module.exports.controllers = controllers;
  module.exports.model = model;
}
