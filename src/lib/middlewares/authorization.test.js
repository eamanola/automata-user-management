const { errors } = require('automata-utils');

const router = require('../router');
const { deleteUsers, tokenCreator } = require('../../../jest/test-helpers');
const authorization = require('./authorization');

let db;

const SECRET = `shhhhh ${Math.random()}`;
const getToken = tokenCreator({ SECRET });
const setUserFromToken = authorization({ SECRET });

describe('authorization', () => {
  beforeAll(async () => {
    db = global.client;

    router({ db, SECRET });
  });

  afterEach(async () => deleteUsers(db));

  it('should add user to request', async () => {
    const email = 'foo@example.bar';
    const password = 'foo';

    const token = await getToken({ email, password });

    const req = { get: (/* authorization */) => `bearer ${token}` };
    const res = {};
    const next = () => {};

    expect(req.user).toBeFalsy();

    await setUserFromToken(req, res, next);

    expect(req.user).toEqual(expect.objectContaining({ email }));
  });

  it('should not add user, if token is missing', async () => {
    let error;
    const req = { get: (/* authorization */) => '' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();
    expect(req.get('authorization')).toBeFalsy();

    await setUserFromToken(req, res, next);

    expect(error).toBeFalsy();
    expect(req.user).toBeFalsy();
  });

  it('should not add user, if token is invalid bearer', async () => {
    const { accessDenied } = errors;

    let error;
    const req = { get: (/* authorization */) => 'bearer foo' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();
    expect(req.get('authorization')).toBeTruthy();

    await setUserFromToken(req, res, next);

    expect(error).toEqual(accessDenied);
    expect(req.user).toBeFalsy();
  });
});
