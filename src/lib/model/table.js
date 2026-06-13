const columns = [
  {
    name: 'email', required: true, type: String, unique: true,
  },
  {
    name: 'id', required: true, type: String, unique: true,
  },
  { name: 'passwordHash', required: true, type: String },
];

const indexes = [
  {
    columns: ['id'],
    name: 'idx-Users-id',
    unique: true,
  },
  {
    columns: ['email'],
    name: 'idx-Users-email',
    unique: true,
  },
];

const name = 'Users';

module.exports = { columns, indexes, name };
