const hashPassword = require('./hash-password');
const comparePassword = require('./compare-password');

describe('hashpassword', () => {
  it('should hash password', async () => {
    const password = '123';

    const hashed = await hashPassword(password);

    expect(password).not.toBe(hashed);
    expect(await comparePassword(password, hashed)).toBe(true);
  });
});
