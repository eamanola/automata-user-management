const controller = require('../controllers/request');
const { NODE_ENV } = require('../../config');

const request = ({ EMAIL_VERIFICATION_SECRET }) => {
  const requestVerification = controller({ EMAIL_VERIFICATION_SECRET });

  return async (req, res, next) => {
    try {
      const { email, byLink, byCode } = req.body;

      const { token, code } = await requestVerification(email, { byCode, byLink });

      let responseBody = { message: 'OK' };

      if (NODE_ENV === 'test') {
        responseBody = { ...responseBody, code, token };
      }

      res.status(200).json(responseBody);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = request;
