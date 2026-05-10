const express = require('express');
const supertest = require('supertest');
const { connectDB, closeDB } = require('automata-db');

const { createUser, deleteAll } = require('../../jest/test-helpers');
const sendEmailVerificationMail = require('../utils/send-email-verification-mail');
const { findOne } = require('../model');
const router = require('../router');

jest.mock('../utils/send-email-verification-mail');

let api;
let client;

describe('request verification', () => {
  beforeAll(async () => {
    client = await connectDB();

    const app = express();

    app.use(express.json());

    app.use('/email-verification', router({ db: client }));

    api = supertest(app);
  });

  afterAll(async () => {
    await deleteAll(client);
    await closeDB(client);
  });

  it('should send verification mail', async () => {
    const { email } = await createUser();

    const byCode = 'http://example.com/form-to-enter-your-code';
    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    await api.post('/email-verification')
      .send({ byCode, byLink, email });

    const { code } = await findOne(email);

    expect(sendEmailVerificationMail).toHaveBeenCalledWith(expect.objectContaining({
      byCode,
      code,
      to: email,
      token: expect.any(String),
    }));
  });
});
