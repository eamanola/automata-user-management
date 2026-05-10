const express = require('express');
const { middlewares } = require('automata-utils');

const userErrors = require('./errors');
const { login, signup, changePassword } = require('./routes');
const { authorization } = require('./middlewares');
const { init: initModel } = require('./model');

const { errorHandler, requireUser } = middlewares;

const router = ({ db }) => {
  initModel(db);

  const expressRouter = express.Router();

  expressRouter.post('/signup', signup);

  expressRouter.post('/login', login);

  expressRouter.use(authorization);

  expressRouter.put('/password', requireUser, changePassword);

  expressRouter.use(errorHandler(userErrors, { defaultTo500: false }));

  return expressRouter;
};

module.exports = router;
