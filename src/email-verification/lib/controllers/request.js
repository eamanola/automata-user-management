// const { userNotFoundError } = require('../../users/errors');
const { utils } = require('automata-utils');

const { emailVerifiedError } = require('../errors');
const { findOne } = require('../model');
const sendEmailVerificationMail = require('../utils/send-email-verification-mail');
const { setUnverified } = require('./set-status');

const { logger, token: emailVerificationToken } = utils;
const { encode } = emailVerificationToken;

const request = ({ EMAIL_VERIFICATION_SECRET }) => async (
  email,
  { byCode = null, byLink = null },
) => {
  // if (!user) {
  //   throw userNotFoundError;
  // }
  const oldRequest = await findOne(email);

  const alreadyVerified = oldRequest !== null && oldRequest.code === null;
  if (alreadyVerified) {
    throw emailVerifiedError;
  }

  let code;
  try {
    code = await setUnverified(email);
  } catch (err) {
    logger.info(err);
    throw err;
  }

  const token = byLink
    ? encode(
      { byLink, code, email },
      EMAIL_VERIFICATION_SECRET,
      { expiresIn: '1d' },
    )
    : null;

  sendEmailVerificationMail({
    byCode,
    code: byCode ? code : null,
    to: email,
    token,
  });

  return { code, token };
};

module.exports = request;
