const router = require('./router');
const { isVerified, setUnverified, setVerified } = require('./controllers/set-status');

module.exports = {
  isVerified,
  router,
  setUnverified,
  setVerified,
};
