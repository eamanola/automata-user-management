const { errors } = require('automata-utils');

const changePassword = require('./change-password');
const signup = require('./create');
const login = require('./authenticate');
const userFromToken = require('./authorize');

const { findUser, countUsers, deleteUsers } = require('../../../jest/test-helpers');

const { invalidPasswordError, userNotFoundError, sessionExipred } = require('../errors');

const { paramError } = errors;

describe('change-password', () => {
  afterEach(deleteUsers);

  it('should update a password', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const user = await findUser({ email });

    const newPassword = '234';
    expect(newPassword).not.toBe(password);
    await changePassword(user, newPassword);

    expect(await login({ email, password: newPassword })).toBeTruthy();

    try {
      await login({ email, password });
    } catch ({ message }) {
      expect(message).toBe(invalidPasswordError.message);
    }
  });

  it('should return a new token', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const { token: oldToken } = await login({ email, password });

    expect(await userFromToken(oldToken)).toEqual(expect.objectContaining({ email }));

    const user = await findUser({ email });
    const { token: newToken } = await changePassword(user, '234');
    expect(await userFromToken(newToken)).toEqual(expect.objectContaining({ email }));

    try {
      expect(await userFromToken(oldToken)).toEqual(expect.objectContaining({ email }));
      expect('unreachable').toBe(true);
    } catch (err) {
      expect(err).toEqual(sessionExipred);
    }
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

    try {
      await changePassword(fakeUser, '123');
      expect('unreachable').toBe(true);
    } catch (err) {
      expect(err).toEqual(userNotFoundError);
    }
    expect(await countUsers()).toBe(0);
  });
});
