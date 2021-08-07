const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

// all calls to the product database
class ProductQueryService {
  async addProduct(dataToInsert) {
    return await knex('product').insert(dataToInsert);
  }

  async getAll() {
    return await knex('product').select();
  }

  async getProductById(id) {
    return await knex('product').select().where({ product_id: id });
  }

  async getByCategory(category) {
    return await knex('product').select().where({ product_category: category });
  }

  async updateProduct(dataToUpdate) {
    return await knex('product')
      .update(dataToUpdate.body)
      .where({ product_id: dataToUpdate.product_id });
  }

  async deleteProduct(id) {
    return await knex('product').delete().where({ product_id: id });
  }
}

module.exports = new ProductQueryService();
