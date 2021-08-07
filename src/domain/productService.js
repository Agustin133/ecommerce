const log4js = require('../../private_modules/default/logerHandler/log4js');
const productQueryService = require('../infrastructure/services/productQueryService');

const logger = log4js.log();
const loggerConsole = logger.getLogger();

class ProductService {
  async getProductById(params) {
    let ERROR;
    try {
      // get the product by id
      const response = await productQueryService.getProductById(params);
      if (response.length == 0) {
        ERROR = 'Product not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else {
        return response[0];
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async getAll() {
    try {
      // get all products
      const response = await productQueryService.getAll();
      return response;
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async getProductByFilter(params) {
    try {
      // get a product by a category
      const response = await productQueryService.getByCategory(params);
      return response;
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async addProduct(params) {
    let message;
    try {
      // add a product to the DB
      const data = {
        product_title: params.title,
        product_price: params.price,
        product_stock: params.stock,
        product_description: params.description,
        product_category: params.category,
      };
      await productQueryService.addProduct(data);
      message = 'Product added successfully';
      return {
        message,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async updateProduct(params) {
    let message;
    let ERROR;
    try {
      // update a product
      const dataToUpdate = {
        body: {
          product_title: params.body.title,
          product_price: params.body.price,
          product_stock: params.body.stock,
          product_category: params.body.category,
          product_description: params.body.description,
        },
        product_id: params.product_id,
      };
      const updatedProduct = await productQueryService.updateProduct(
        dataToUpdate
      );
      // if the product does not exist
      if (updatedProduct == 0) {
        ERROR = 'Product not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      message = 'Product updated successfully';
      return {
        message,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async deleteProduct(params) {
    let message;
    let ERROR;
    try {
      // delete one product
      const deletedProduct = await productQueryService.deleteProduct(params);
      if (deletedProduct == 0) {
        ERROR = 'Product not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      message = 'Product deleted successfully';
      return {
        message,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }
}

module.exports = new ProductService();
