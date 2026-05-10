const express = require('express');
const { middlewares } = require('automata-utils');

const { init: initModel } = require('./model');
const errors = require('./errors');
const request = require('./routes/request');
const verifyByLink = require('./routes/verify/by-link');
const verifyByCode = require('./routes/verify/by-code');

const { requireUser, errorHandler } = middlewares;

const router = ({ db, EMAIL_VERIFICATION_SECRET }) => {
  initModel(db);

  const expressRouter = express.Router();

  expressRouter.get('/', verifyByLink({ EMAIL_VERIFICATION_SECRET }));

  expressRouter.post('/', request({ EMAIL_VERIFICATION_SECRET }));

  expressRouter.patch('/', requireUser, verifyByCode);

  expressRouter.use(errorHandler(errors, { defaultTo500: false }));

  return expressRouter;
};

module.exports = router;
