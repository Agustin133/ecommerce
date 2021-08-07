const orderQueryService = require('../infrastructure/services/orderQueryService');
const userData = require('../../private_modules/validators/accessTokenValidator');
const orderDtoService = require('../infrastructure/DTO/orderDto');
const nodemailer = require('../../private_modules/default/nodemailer/nodemailer');
const log4js = require('../../private_modules/default/logerHandler/log4js');

const logger = log4js.log();
const loggerConsole = logger.getLogger();

class OrderService {
  async getOrdersInProgress() {
    let ERROR;
    try {
      // get user information from the token
      const userToken = userData.tokens[0];
      // get order information
      const orderInfo = await orderQueryService.getOrders(
        userToken.user.user_id
      );
      // get cart information
      const cartInfo = await orderQueryService.getCart(userToken.user.user_id);
      // get user direction
      const directionInfo = await orderQueryService.getDirection(
        userToken.user.user_id
      );
      if (orderInfo.length == 0) {
        return [];
      } else if (cartInfo.length == 0) {
        ERROR = 'The cart does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      } else {
        // send the info to my order dto service to response the correct information
        return await orderDtoService.getOrder(
          orderInfo[0],
          cartInfo,
          directionInfo[0]
        );
      }
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async getOrders() {
    let ERROR;
    try {
      // get all the orders from the user
      const userToken = userData.tokens[0];
      const orders = await orderQueryService.getUserOrders(
        userToken.user.user_id
      );
      if (orders.length == 0) {
        ERROR = 'Order not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      const response = await orderDtoService.getUserOrders(orders);
      return response;
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async deleteOrder(params) {
    let message;
    let ERROR;
    try {
      // delete an order
      const userToken = userData.tokens[0];
      const order = await orderQueryService.deleteOrder(
        params,
        userToken.user.user_id
      );
      if (order == 0) {
        ERROR = 'Order not found';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      message = 'The order was deleted successfully';
      return {
        message,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }

  async completeOrder() {
    let message;
    let ERROR;
    try {
      const userToken = userData.tokens[0];
      const orderInfo = await orderQueryService.getOrders(
        userToken.user.user_id
      );
      const cartInfo = await orderQueryService.getCart(userToken.user.user_id);
      const directionInfo = await orderQueryService.getDirection(
        userToken.user.user_id
      );
      // if the order and the cart does not exists
      if (orderInfo.length == 0) {
        ERROR = 'The order does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      if (cartInfo.length == 0) {
        ERROR = 'The cart does not exist';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      // if the order is not in 'generated' state
      if (
        orderInfo[0].order_condition.toLowerCase() != 'generated' &&
        orderInfo[0].order_condition.toLowerCase() != 'completed'
      ) {
        ERROR = 'The order must by in "generated" condition';
        loggerConsole.warn(ERROR);
        return {
          ERROR,
        };
      }
      const dataToSend = await orderDtoService.getOrder(
        orderInfo[0],
        cartInfo,
        directionInfo[0]
      );
      // an e-mail is sent to the user to notify that the order was completed.
      const mail = nodemailer.transporter();
      const options = nodemailer.mailOptions(
        dataToSend,
        cartInfo[0].user_email
      );
      mail.sendMail(options);
      // add the order to the order registration table
      // and change the status of the order to completed
      const registOrder = await orderDtoService.registOrder(orderInfo[0]);
      await orderQueryService.registOrder(registOrder);
      // clean cart and order
      await orderQueryService.cleanCart(userToken.user.user_id);
      message = 'Order completed successfully';
      return {
        message,
      };
    } catch (err) {
      loggerConsole.error(err);
    }
  }
}

module.exports = new OrderService();
