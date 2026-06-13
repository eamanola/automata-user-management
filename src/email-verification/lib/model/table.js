const columns = [
  {
    name: 'email',
    required: true,
    type: String,
    unique: true,
  },
  { name: 'code', type: Number },
];

const indexes = [
  {
    columns: ['email'],
    name: 'idx-email-verification-email',
    unique: true,
  },
];

const name = 'email-verification';

module.exports = {
  columns,
  indexes,
  name,
};
