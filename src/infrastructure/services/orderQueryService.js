/* eslint-disable camelcase */
const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

// all calls to the order database
class OrderQueryService {
  async getCart(params) {
    return await knex('cart')
      .join('user', { 'user.user_id': 'cart.user_id' })
      .select()
      .where('user.user_id', params);
  }

  async getOrders(params) {
    return await knex('order').select().where({ user_id: params });
  }

  async getUserOrders(params) {
    return await knex('order_register').select().where({ user_id: params });
  }

  async getDirection(params) {
    return await knex('user_direction').select().where({ user_id: params });
  }

  async deleteOrder(params, user_id) {
    return await knex('order')
      .delete()
      .where({ order_id: params, user_id: user_id });
  }

  async cleanCart(params) {
    await knex('cart').delete().where({ user_id: params });
    return await knex('order').delete().where({ user_id: params });
  }

  async registOrder(params) {
    return await knex('order_register').insert(params);
  }
}

module.exports = new OrderQueryService();
