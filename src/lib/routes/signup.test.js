const express = require('express');
const supertest = require('supertest');
const { errors } = require('automata-utils');
const { connectDB, closeDB } = require('automata-db');
const { router: emailVerificationRouter } = require('automata-email-verification');

const { countUsers, deleteUsers, findUser } = require('../../../jest/test-helpers');
const userErrors = require('../errors');
const router = require('../router');

let db;
let api;

describe('/signup', () => {
  beforeAll(async () => {
    db = await connectDB(':memory:');
    emailVerificationRouter({ db });
    const app = express();
    app.use(express.json());
    app.use(router({ db }));
    api = supertest(app);
  });

  afterAll(async () => {
    closeDB(db);
  });

  afterEach(async () => deleteUsers(db));

  it('should return 201 OK', async () => {
    const credentials = { email: 'foo@example.com', password: '123' };

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('OK');
    expect(await findUser({ email: credentials.email })).toBeTruthy();
  });

  it('should throw emailTakenError, on dublicate', async () => {
    const { emailTakenError } = userErrors;
    const credentials = { email: 'foo@example.com', password: '123' };

    await api.post('/signup').send(credentials);

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(emailTakenError.status);
    expect(response.body.message).toBe(emailTakenError.message);
    expect(await countUsers(db)).toBe(1);
  });

  it('should throw paramError, on invalid params', async () => {
    const { paramError } = errors;

    expect((await api.post('/signup').send({ email: 'foo', password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ email: 'foo@example.com' })).status)
      .toBe(paramError.status);
    expect(await countUsers(db)).toBe(0);
  });
});
