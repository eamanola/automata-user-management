const { authenticate: controller } = require('../controllers');

const authenticate = ({ SECRET }) => {
  const login = controller({ SECRET });

  return async (req, res, next) => {
    let error = null;

    const { body } = req;

    try {
      const { emailVerified, token } = await login(body);
      res.status(200).json({ emailVerified, message: 'OK', token });
    } catch (err) {
      error = err;
    }

    next(error);
  };
};

module.exports = authenticate;
