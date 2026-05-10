const express = require('express');
const { middlewares } = require('automata-utils');

const userErrors = require('./errors');
const { login, signup, changePassword } = require('./routes');
const { authorization } = require('./middlewares');
const { init: initModel } = require('./model');
const { router: emailVerificationRouter } = require('../email-verification');

const { errorHandler, requireUser } = middlewares;

const router = ({ db, SECRET, EMAIL_VERIFICATION_SECRET }) => {
  initModel(db);

  const expressRouter = express.Router();

  expressRouter.post('/signup', signup);

  expressRouter.post('/login', login({ SECRET }));

  expressRouter.use(authorization({ SECRET }));

  expressRouter.put('/password', requireUser, changePassword);

  expressRouter.use(errorHandler(userErrors, { defaultTo500: false }));

  expressRouter.use(
    '/email-verification',
    emailVerificationRouter({ db, EMAIL_VERIFICATION_SECRET }),
  );

  return expressRouter;
};

module.exports = router;
