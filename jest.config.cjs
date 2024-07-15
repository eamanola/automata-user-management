module.exports = {
  setupFiles: [
    './jest/jest.setup.config.js',
  ],
  setupFilesAfterEnv: [
    './jest/jest.setup.db.js',
  ],
};
