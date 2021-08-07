const { options } = require('./mariaDB');
const knex = require('knex')(options);

knex.schema
  .createTable('Product', (table) => {
    table.increments('product_id');
    table.string('product_title');
    table.float('product_price');
    table.integer('product_stock');
    table.string('product_category');
    table.timestamp('product_timestamp').defaultTo(knex.fn.now());
    table.string('product_description');
  })
  .then(() => console.log('table created'))
  .catch((err) => console.log(err))
  .finally(() => {
    knex.destroy();
  });
