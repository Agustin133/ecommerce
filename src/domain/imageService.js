const imageQueryService = require('../infrastructure/services/imageQueryService');
const log4js = require('../../private_modules/default/logerHandler/log4js');

const logger = log4js.log();
const loggerConsole = logger.getLogger();
process.setMaxListeners(0);

class ImageService {
  async addImage(params) {
    let ERROR;
    let file;
    try {
      const dataToInsert = {
        product_id: params.product_id,
        image_url: params.file,
      };
      // get product info and validate that the product exists
      const productInfo = await imageQueryService.getProduct(params.product_id);
      if (productInfo.length == 0) {
        ERROR = 'The product does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      // add an image to the product
      await imageQueryService.addImage(dataToInsert);
      file = params.file;
      return {
        file,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async getImages(params) {
    let ERROR;
    try {
      // get all images from one user
      const response = await imageQueryService.getImages(params);
      if (response.length == 0) {
        ERROR = 'Image not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else {
        return response;
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async deleteImage(params) {
    let ERROR;
    let message;
    try {
      // validate that the image exist
      const response = await imageQueryService.getImagesById(params);
      if (response.length == 0) {
        ERROR = 'The image does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else {
        // delete the image
        await imageQueryService.deleteImage(params);
        message = 'Image deleted successfully';
        return {
          message,
        };
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }
}

module.exports = new ImageService();
