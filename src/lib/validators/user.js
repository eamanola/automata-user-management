const { string, object/* , number */ } = require('yup');

const passwordHashSchema = string().required();

const userSchema = object({
  email: string().email().required(),
  id: string().required(),
  passwordHash: passwordHashSchema,
}).noUnknown().strict();

module.exports = { passwordHashSchema, userSchema };
