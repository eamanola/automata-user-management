const express = require('express');
const supertest = require('supertest');

const {
  createUser,
  deleteAll,
  isVerified,
  setUnverified,
} = require('../../../jest/test-helpers');
const { request: requestController } = require('../../controllers');
const router = require('../../router');

let api;
const { db } = global;

const EMAIL_VERIFICATION_SECRET = `shhhhh ${Math.random()}`;
const request = requestController({ EMAIL_VERIFICATION_SECRET });

describe('by-link', () => {
  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/email-verification', router({ db, EMAIL_VERIFICATION_SECRET }));
    api = supertest(app);
  });

  afterEach(async () => {
    await deleteAll(db);
  });

  it('should verify email', async () => {
    const { email } = await createUser();
    expect(await isVerified(email)).toBe(false);

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    const { token } = await request(email, { byLink });

    await api.get(`/email-verification?token=${token}`);

    expect(await isVerified(email)).toBe(true);
  });

  it('should redirect to onSuccess', async () => {
    const { email } = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    const { token } = await request(email, { byLink });

    await api.get(`/email-verification?token=${token}`)
      .expect('Location', onSuccess);
  });

  it('should redirect to onFail', async () => {
    const { email } = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    const { token } = await request(email, { byLink });

    // refresh code
    await setUnverified(email);

    await api.get(`/email-verification?token=${token}`)
      .expect('Location', onFail);
  });
});
