global.db = require('automata-db')({ DB_ENGINE: 'sqlite' });

beforeAll(async () => {
  await global.db.connectDB(':memory:');
});

afterAll(async () => {
  await global.db.closeDB();
});
