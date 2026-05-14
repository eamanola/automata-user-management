const express = require('express');
const supertest = require('supertest');

const { createUser, deleteAll, isVerified } = require('../../../jest/test-helpers');
const { findOne } = require('../../model');
const router = require('../../router');

const email = 'foo@example.com';

let api;
const { db } = global;

const EMAIL_VERIFICATION_SECRET = `shhhhh ${Math.random()}`;

describe('by-code', () => {
  beforeAll(async () => {
    const app = express();

    app.use(express.json());

    app.use((req, res, next) => { req.user = { email }; next(); });

    app.use('/email-verification', router({ db, EMAIL_VERIFICATION_SECRET }));

    api = supertest(app);
  });

  afterEach(() => deleteAll(db));

  it('should verify email', async () => {
    await createUser({ email });

    const { code } = await findOne(email);
    expect(await isVerified(email)).toBe(false);
    expect(code).toEqual(expect.any(Number));

    await api.patch('/email-verification').send({ code });

    expect(await isVerified(email)).toBe(true);
  });

  it('should fail if wrong code', async () => {
    await createUser({ email });

    const wrongCode = 2000;
    const { code } = await findOne(email);
    expect(wrongCode).not.toBe(code);

    await api.patch('/email-verification').send({ code: wrongCode });

    expect(await isVerified(email)).toBe(false);
  });
});
