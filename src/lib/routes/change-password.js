const { changePassword: controller } = require('../controllers');

const changePassword = async (req, res, next) => {
  let error = null;

  const { user, body } = req;
  const { newPassword } = body;

  try {
    await controller(user, newPassword);
    res.status(200).json({ message: 'OK' });
  } catch (err) {
    error = err;
  }

  next(error);
};

module.exports = changePassword;
