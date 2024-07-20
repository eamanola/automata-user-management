const express = require('express');
const supertest = require('supertest');
const { errors } = require('automata-utils');

const { deleteUsers, getToken } = require('../../../jest/test-helpers');

const { invalidPasswordError } = require('../errors');

const { accessDenied, paramError } = errors;

const router = require('../router');

const app = express();
app.use(express.json());
app.use(router);
const api = supertest(app);

describe('PUT /password', () => {
  afterEach(deleteUsers);

  it('should return 200 OK, and change password', async () => {
    const credentials = { email: 'foo@example.com', password: '123' };
    const token = await getToken(credentials);
    const newPassword = '234';
    expect(newPassword).not.toBe(credentials.password);

    const { status } = await api
      .put('/password')
      .set({ Authorization: `bearer ${token}` })
      .send({ newPassword });

    expect(status).toBe(200);

    const { body: loginOld } = await api.post('/login').send({ ...credentials });
    expect(loginOld.message).toBe(invalidPasswordError.message);

    const { status: loginStatus } = await api.post('/login')
      .send({ ...credentials, password: newPassword });
    expect(loginStatus).toBe(200);
  });

  it('should require user', async () => {
    const { status } = await api
      .put('/password')
      .set({ Authorization: 'bearer fakeToken' })
      .send({ newPassword: '123' });

    expect(status).toBe(accessDenied.status);
  });

  it('should require newPassword', async () => {
    const token = await getToken();
    const { status } = await api
      .put('/password')
      .set({ Authorization: `bearer ${token}` })
      .send({ newPassword: '' });

    expect(status).toBe(paramError.status);
  });
});
