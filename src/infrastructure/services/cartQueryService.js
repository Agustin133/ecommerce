const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

// all calls to the cart database
class CartQueryService {
  async createCart(dataToInsert) {
    return await knex('cart').insert({
      user_id: dataToInsert.user_id,
      user_cart_id: dataToInsert.user_id,
      product_id: dataToInsert.body.product_id,
      product_quantity: dataToInsert.body.quantity,
    });
  }

  async getCart(params) {
    return await knex('cart')
      .join('user', { 'user.user_id': 'cart.user_id' })
      .select()
      .where('user.user_id', params);
  }

  async getProduct(params) {
    return await knex('product')
      .select()
      .where({ product_id: params.body.product_id });
  }

  async getProducts() {
    return await knex('product').select();
  }

  async addProduct(dataToInsert) {
    return await knex('cart')
      .insert({
        product_id: dataToInsert.product_id,
        user_id: dataToInsert.user_id,
        user_cart_id: dataToInsert.user_id,
        product_quantity: dataToInsert.product_quantity,
      })
      .where({ cart_id: dataToInsert.cart_id });
  }

  async deleteProducts(dataToDelete) {
    return await knex('cart').delete().where({
      product_id: dataToDelete.product_id,
      product_quantity: dataToDelete.quantity,
    });
  }

  async submitCart(dataToInsert) {
    return await knex('order').insert(dataToInsert);
  }

  async getOrder() {
    return await knex('order').select();
  }

  async deleteCart(params) {
    return await knex('cart').delete().where({ user_id: params });
  }
}

module.exports = new CartQueryService();
