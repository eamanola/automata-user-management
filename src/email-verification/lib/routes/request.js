const controller = require('../controllers/request');

const request = ({ EMAIL_VERIFICATION_SECRET }) => {
  const requestVerification = controller({ EMAIL_VERIFICATION_SECRET });

  return async (req, res, next) => {
    try {
      const { email, byLink, byCode } = req.body;

      await requestVerification(email, { byCode, byLink });

      res.status(200).json({ message: 'OK' });
    } catch (err) {
      next(err);
    }
  };
};

module.exports = request;
