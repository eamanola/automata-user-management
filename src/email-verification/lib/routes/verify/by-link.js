const controller = require('../../controllers/verify/by-link');

const verifyByLink = ({ EMAIL_VERIFICATION_SECRET }) => {
  const verify = controller({ EMAIL_VERIFICATION_SECRET });

  return async (req, res, next) => {
    try {
      const { token } = req.query;

      const redirectTo = await verify(token);

      res.redirect(301, redirectTo);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = verifyByLink;
