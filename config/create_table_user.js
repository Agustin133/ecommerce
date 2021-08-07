const { options } = require('./mariaDB');
const knex = require('knex')(options);

knex.schema
  .createTable('user', (table) => {
    table.increments('user_id');
    table.string('user_first_name');
    table.string('user_last_name');
    table.string('user_password');
    table.string('user_email');
    table.string('user_phone_number');
    table.boolean('user_admin');
  })
  .then(() => console.log('table created'))
  .catch((err) => console.log(err))
  .finally(() => {
    knex.destroy();
  });
