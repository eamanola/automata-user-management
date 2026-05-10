const router = require('../router');
const {
  countUsers,
  deleteUsers,
  isEmailVerified,
  setEmailStatus,
} = require('../../../jest/test-helpers');
const { create: signup, authorize } = require('.');
const authenticate = require('./authenticate');

let db;

const SECRET = `shhhhh ${Math.random()}`;
const login = authenticate({ SECRET });
const userFromToken = authorize({ SECRET });

describe('authenticate', () => {
  beforeAll(async () => {
    db = global.client;

    router({ db, SECRET });
  });

  afterEach(async () => deleteUsers(db));

  it('should return a token', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const { token } = await login({ email, password });

    expect(token).toBeTruthy();
    expect(token).not.toEqual(expect.objectContaining({ email }));
    expect(await userFromToken(token)).toEqual(expect.objectContaining({ email }));
  });

  it('should return emailVerified', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const { emailVerified, token } = await login({ email, password });
    expect(emailVerified).toBe(false);

    await userFromToken(token);
    await setEmailStatus({ email, verified: true });
    const { emailVerified: emailVerifiedUpdated } = await login({ email, password });
    expect(emailVerifiedUpdated).toBe(true);
  });

  it('should require existing user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await countUsers(db, { email })).toBe(0);

    try {
      await login({ email, password });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/not found/u.test(message)).toBe(true);
    }
  });

  it('should require correct password', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    try {
      await login({ email, password: 'foobar' });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/Login failed/u.test(message)).toBe(true);
    }
  });

  it('should accept optional require verified email', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    expect(await isEmailVerified(email)).toBe(false);
    await login({ email, password }, { REQUIRE_VERIFIED_EMAIL: false });

    try {
      await login({ email, password }, { REQUIRE_VERIFIED_EMAIL: true });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/Email Not Verified/u.test(message)).toBe(true);
    }
  });
});
