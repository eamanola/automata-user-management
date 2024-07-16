const hashPassword = require('./hash-password');
const comparePassword = require('./compare-password');

describe('hashpassword', () => {
  it('should validate password', async () => {
    const password = '123';

    const hashed = await hashPassword(password);

    expect(password).not.toBe(hashed);
    expect(await comparePassword(password, hashed)).toBe(true);
  });

  it('should fail invalid password', async () => {
    const password = '123';
    const fake = '234';

    const hashed = await hashPassword(password);

    expect(password).not.toBe(fake);
    expect(await comparePassword(fake, hashed)).toBe(false);
  });

  it('should fail invalid hash', async () => {
    const password = '123';

    const hashed = '234';

    expect(await comparePassword(password, hashed)).toBe(false);
  });

  it('should require password', async () => {
    try {
      await comparePassword(null, '123');
      expect('unreachable').toBe(true);
    } catch ({ message }) {
      expect(/required/ui.test(message)).toBe(true);
    }
  });

  it('should require hash', async () => {
    try {
      await comparePassword('123', null);
      expect('unreachable').toBe(true);
    } catch ({ message }) {
      expect(/required/ui.test(message)).toBe(true);
    }
  });
});
