const { errors } = require('automata-utils');

const router = require('../router');
const {
  deleteUsers, findUser, updateUser, tokenCreator,
} = require('../../../jest/test-helpers');
const userErrors = require('../errors');
const authorize = require('./authorize');

const { db } = global;

const SECRET = `shhhhh ${Math.random()}`;
const getToken = tokenCreator({ SECRET });
const userFromToken = authorize({ SECRET });

describe('authorize', () => {
  beforeAll(async () => {
    router({ db, SECRET });
  });

  afterEach(async () => deleteUsers(db));

  it('should return a user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    const token = await getToken({ email, password });
    const user = await userFromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
  });

  it('should not return passwordHash', async () => {
    const email = 'foo@example.com';
    const password = '123';

    const token = await getToken({ email, password });
    const user = await userFromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
    const userFromDB = await findUser(db, { email });

    expect(userFromDB).toEqual(expect.objectContaining(user));
    expect(userFromDB.passwordHash).toBeTruthy();
    expect(user.passwordHash).toBe(undefined);
  });

  it('should return falsy, if no token', async () => {
    const user = await userFromToken(null);

    expect(user).toBeFalsy();
  });

  it('should throw access denied, if token is invalid', async () => {
    const { accessDenied } = errors;

    try {
      const token = 'fakeToken';
      await userFromToken(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(accessDenied.name);
    }
  });

  it('should throw sessionExpired, if password changed', async () => {
    const { sessionExipred } = userErrors;
    const email = 'foo@example.com';
    const password = '123';

    const token = await getToken({ email, password });

    await updateUser(db, { email }, { passwordHash: 'a new hash' });

    try {
      await userFromToken(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(sessionExipred.name);
    }
  });

  it('should throw sessionExpired, if email changed', async () => {
    const { sessionExipred } = userErrors;
    const email = 'foo@example.com';
    const password = '123';

    const token = await getToken({ email, password });

    await updateUser(db, { email }, { email: 'bar@example.com' });

    try {
      await userFromToken(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(sessionExipred.name);
    }
  });
});
