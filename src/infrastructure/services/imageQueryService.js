const { options } = require('../../../config/mariaDB');
const knex = require('knex')(options);

// all calls to the image database
class ImageQueryService {
  async addImage(params) {
    return await knex('image').insert(params);
  }

  async getProduct(params) {
    return await knex('product').select().where({ product_id: params });
  }

  async getImages(params) {
    return await knex('image').select().where({ product_id: params });
  }

  async getImagesById(params) {
    return await knex('image').select().where({ image_id: params });
  }

  async deleteImage(params) {
    return await knex('image').delete().where({ image_id: params });
  }
}

module.exports = new ImageQueryService();
