module.exports = {
  setupFiles: ['./src/email-verification/jest/jest.setup.config.js'],
  setupFilesAfterEnv: ['./jest/jest.setup.db.js', './src/email-verification/jest/jest.setup.db.js'],
};
