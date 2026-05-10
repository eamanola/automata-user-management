const { utils } = require('automata-utils');

const { authorize: controller } = require('../controllers');

const { extractToken } = utils;

const authorization = ({ SECRET }) => {
  const userFromToken = controller({ SECRET });

  return async (req, res, next) => {
    let error = null;

    try {
      const token = extractToken(req.get('authorization'));
      const user = await userFromToken(token);

      req.user = user;
    } catch (err) {
      error = err;
    }

    next(error);
  };
};

module.exports = authorization;
