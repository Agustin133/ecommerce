/* eslint-disable camelcase */
const cartQueryService = require('../infrastructure/services/cartQueryService');
const userData = require('../../private_modules/validators/accessTokenValidator');
const cartDtoService = require('../infrastructure/DTO/cartDto');
const log4js = require('../../private_modules/default/logerHandler/log4js');
const nodemailer = require('../../private_modules/default/nodemailer/nodemailer');

const logger = log4js.log();
const loggerConsole = logger.getLogger();

class CartService {
  async getCart() {
    try {
      // get user token and cart information to make validations
      const userToken = userData.tokens[0];
      const cartInfo = await cartQueryService.getCart(userToken.user.user_id);
      if (cartInfo.length == 0) {
        return [];
      } else {
        // get cart from cart dto service
        const cart = await cartDtoService.getCart(cartInfo);
        return cart;
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async addProduct(params) {
    let ERROR;
    try {
      const userToken = userData.tokens[0];
      const data = { user_id: userToken.user.user_id, body: params };
      // get info user
      const userInfo = await cartQueryService.getCart(data.user_id);
      // get product info
      const productInfo = await cartQueryService.getProduct(data);
      // create a cart if this does not exist
      if (userInfo.length == 0) {
        if (productInfo.length == 0) {
          ERROR = 'Product not found';
          loggerConsole.warn(ERROR);
          return {
            ERROR,
          };
        }
        // validate stock
        if (productInfo[0].product_stock < data.body.quantity) {
          ERROR = `Max stock allowed ${productInfo[0].product_stock}`;
          loggerConsole.warn(ERROR);
          return {
            ERROR,
          };
        }
        // create cart
        await cartQueryService.createCart(data);
        // get the car information and then call my car service dto return the correct information
        const cartInfo = await cartQueryService.getCart(userToken.user.user_id);
        const cart = await cartDtoService.getCart(cartInfo);
        return cart;
      }
      // if the product does not exists
      if (productInfo.length == 0) {
        ERROR = 'Product not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      const dataUserProduct = {
        cart_id: userInfo[0].cart_id,
        user_id: data.user_id,
        product_quantity: data.body.quantity,
        product_id: productInfo[0].product_id,
      };
      // If the product quantity is not valid
      if (productInfo[0].product_stock < data.body.quantity) {
        ERROR = `Max stock allowed ${productInfo[0].product_stock}`;
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      // add product to my cart
      await cartQueryService.addProduct(dataUserProduct);
      const cartInfo = await cartQueryService.getCart(data.user_id);
      const cart = await cartDtoService.getCart(cartInfo);
      return cart;
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async deleteProduct(params) {
    let message;
    let ERROR;
    try {
      const userToken = userData.tokens[0];
      const cartInfo = await cartQueryService.getCart(userToken.user.user_id);
      // if the cart does not exist
      if (cartInfo.length == 0) {
        ERROR = 'Product not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else if (cartInfo[0]) {
        // validates that my user and cart exist
        let existProduct = false;
        let existStock = false;
        cartInfo.forEach((cartElements) => {
          if (cartElements.product_id == params.product_id) {
            existProduct = true;
          }
          if (cartElements.product_quantity == params.quantity) {
            existStock = true;
          }
        });
        if (existProduct == false) {
          ERROR = 'Product not found';
          loggerConsole.warn(ERROR);
          return {
            ERROR,
          };
        } else if (existStock == false) {
          ERROR = 'Invalid stock';
          loggerConsole.warn(ERROR);
          return {
            ERROR,
          };
        } else {
          // delete the product
          await cartQueryService.deleteProducts(params);
          message = 'Product deleted successfuly';
          return {
            message,
          };
        }
      } else {
        ERROR = 'Error';
        return {
          ERROR,
        };
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async submitCart() {
    let ERROR;
    try {
      const userToken = userData.tokens[0];
      const cartInfo = await cartQueryService.getCart(userToken.user.user_id);
      const productInfo = await cartQueryService.getProducts();
      // validates that my cart exists
      if (cartInfo.length == 0) {
        ERROR = 'The cart does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      // generate a purchase order
      let total = 0;
      productInfo.forEach((info) => {
        cartInfo.forEach((cartElement) => {
          if (cartElement.product_id == info.product_id) {
            const tot = cartElement.product_quantity * info.product_price;
            total += tot;
          }
        });
      });
      // validate that there is only one purchase order per user
      const orderInfo = await cartQueryService.getOrder();
      let existsOrder = false;
      orderInfo.forEach((orderElement) => {
        if (orderElement.user_id == userToken.user.user_id) {
          existsOrder = true;
        }
      });
      if (existsOrder == true) {
        ERROR = 'The order already exists';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else {
        const dataToInsert = {
          order_total: total,
          order_condition: 'generated',
          user_id: userToken.user.user_id,
          cart_id: cartInfo[0].user_cart_id,
        };
        // generate a purchase order
        const order_id = await cartQueryService.submitCart(dataToInsert);
        // send an e-mail with the order
        const dataToSend = await cartDtoService.mailInfo(
          cartInfo,
          productInfo,
          dataToInsert
        );
        const mail = nodemailer.transporter();
        const options = nodemailer.cartOptions(
          dataToSend,
          cartInfo[0].user_email
        );
        mail.sendMail(options);
        return {
          order_id: order_id[0],
        };
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }
}

module.exports = new CartService();
