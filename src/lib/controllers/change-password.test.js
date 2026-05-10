const { errors } = require('automata-utils');

const router = require('../router');
const changePassword = require('./change-password');
const signup = require('./create');
const authenticate = require('./authenticate');
const authorize = require('./authorize');
const { findUser, countUsers, deleteUsers } = require('../../../jest/test-helpers');
const { invalidPasswordError } = require('../errors');

const { paramError } = errors;

let db;

const SECRET = `shhhhh ${Math.random()}`;
const login = authenticate({ SECRET });
const userFromToken = authorize({ SECRET });

describe('change-password', () => {
  beforeAll(async () => {
    db = global.client;

    router({ db, SECRET });
  });

  afterEach(async () => deleteUsers(db));

  it('should update a password', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const user = await findUser({ email });

    const newPassword = '234';
    expect(newPassword).not.toBe(password);
    await changePassword(user, newPassword);

    try {
      await login({ email, password });
    } catch ({ message }) {
      expect(message).toBe(invalidPasswordError.message);
    }

    const { token } = await login({ email, password: newPassword });
    expect(await userFromToken(token)).toEqual(expect.objectContaining({ email }));
  });

  it('should require userId and new password', async () => {
    try {
      await changePassword(null, '123');
      expect('unreachable').toBe(true);
    } catch (err) {
      expect(err).toEqual(paramError);
    }

    try {
      await changePassword('foo', null);
      expect('unreachable').toBe(true);
    } catch (err) {
      expect(err).toEqual(paramError);
    }
  });

  it('should have no effect if invalid user', async () => {
    const fakeUser = { email: 'bar@example.con' };
    expect(await findUser(fakeUser)).toBe(null);

    await changePassword(fakeUser, '123');

    expect(await countUsers(db)).toBe(0);
  });
});
