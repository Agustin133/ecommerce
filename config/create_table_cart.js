const { options } = require('./mariaDB');
const knex = require('knex')(options);

knex.schema
  .createTable('Cart', (table) => {
    table.increments('id');
    table.integer('user_id');
    table.string('title');
    table.string('price');
    table.string('stock');
    table.string('code');
    table.string('thumbnail');
    table.string('timestamp');
    table.string('description');
  })
  .then(() => console.log('table created'))
  .catch((err) => console.log(err))
  .finally(() => {
    knex.destroy();
  });
