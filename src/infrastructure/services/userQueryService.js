const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

// all calls to the user database
class UserQueryService {
  async getUserDataAndRole(params) {
    return await knex('user').select().where({ user_email: params.email });
  }

  async register(params) {
    return await knex('user').insert(params);
  }

  async addDirection(params) {
    return await knex('user_direction').insert(params);
  }

  async getUserDirection(params) {
    return await knex('user_direction').select().where({ user_id: params });
  }
}

module.exports = new UserQueryService();
