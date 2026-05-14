const {
  createUser,
  deleteAll,
  isVerified,
  setUnverified,
} = require('../../../jest/test-helpers');
const { request: requestController } = require('..');
const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');
const verifyByLinkController = require('./by-link');
const { init: initModel } = require('../../model');

jest.mock('../../utils/send-email-verification-mail');

const EMAIL_VERIFICATION_SECRET = `shhhhh ${Math.random()}`;
const verifyByLink = verifyByLinkController({ EMAIL_VERIFICATION_SECRET });
const request = requestController({ EMAIL_VERIFICATION_SECRET });

const { db } = global;

describe('email verification', () => {
  beforeAll(async () => {
    await initModel(db);
  });

  afterEach(() => {
    sendEmailVerificationMail.mockClear();

    deleteAll(db);
  });

  describe('verify by link', () => {
    it('should set email verified, and redirect to onSuccess', async () => {
      const { email } = await createUser();
      const onSuccess = 'http://example.com/your-email-has-been-verified';
      const onFail = 'http://example.com/something-went-wrong';
      const byLink = { onFail, onSuccess };

      await request(email, { byLink });
      const { token } = sendEmailVerificationMail.mock.calls[0][0];

      const redirectUrl = await verifyByLink(token);
      expect(redirectUrl).toBe(byLink.onSuccess);

      expect(await isVerified(email)).toBe(true);
    });

    it('should redirect to onFail, if fail', async () => {
      const { email } = await createUser();
      const onSuccess = 'http://example.com/your-email-has-been-verified';
      const onFail = 'http://example.com/something-went-wrong';
      const byLink = { onFail, onSuccess };

      await request(email, { byLink });
      const { token } = sendEmailVerificationMail.mock.calls[0][0];

      // refresh code
      await setUnverified(email);

      const redirectUrl = await verifyByLink(token);
      expect(redirectUrl).toBe(byLink.onFail);

      expect(await isVerified(email)).toBe(false);
    });
  });
});
