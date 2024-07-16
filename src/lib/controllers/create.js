const { setUnverified } = require('automata-email-verification');
const { utils, errors } = require('automata-utils');

const { emailTakenError } = require('../errors');
const signupSchema = require('../validators/signup');
const { findOne, insertOne } = require('../model');
const hashPassword = require('../utils/hash-password');

const { logger } = utils;
const { createParamError } = errors;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async ({ email, password }) => {
  try {
    await signupSchema.validate({ email, password });
  } catch (err) {
    logger.info(err.message);
    throw createParamError(err);
  }

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  const passwordHash = await hashPassword(password);

  await insertOne({ email, passwordHash });

  await setUnverified(email);
};

module.exports = signup;
