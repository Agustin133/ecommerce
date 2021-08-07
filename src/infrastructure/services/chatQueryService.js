const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

class ChatQueryService {
  async getStock() {
    return await knex('product').select();
  }

  async getOrders(params) {
    return await knex('order_register').select().where({ user_id: params });
  }

  async getCart(params) {
    return await knex('cart').select().where({ user_id: params });
  }

  async getProducts() {
    return await knex('product').select();
  }
}

module.exports = new ChatQueryService();
