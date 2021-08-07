const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');
const chatQueryService = require('../services/chatQueryService');
const chatDtoService = require('../DTO/chatDto');
const userData = require('../../../private_modules/validators/accessTokenValidator');
const log4js = require('../../../private_modules/default/logerHandler/log4js');

const logger = log4js.log();
const loggerConsole = logger.getLogger();

// conect the sockets

module.exports = (http) => {
  const io = require('socket.io')(http);
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjE5LCJ1c2VyX2ZpcnN0X25hbWUiOiJ3YXNvIiwidXNlcl9sYXN0X25hbWUiOiJ3YXNvIiwidXNlcl9lbWFpbCI6ImFndXN0aW41b2JlcnRpQGdtYWlsLmNvbSIsInVzZXJfcGhvbmVfbnVtYmVyIjoiMzU0Nzg5NTc4NCIsInVzZXJfYWRtaW4iOjF9LCJpYXQiOjE2MjgwMTI4MzV9.Dr04AIHr1dW-Aa02AZZWqKTbmFgIBtPXLasF_XlgQOI
  io.on('connection', (socket) => {
    loggerConsole.debug('New user connected');
    socket.on('user_token', async function (data) {
      try {
        const response = await accessTokenValidator.verifyTokenChat(data.token);
        if (response == 'Unauthorized') {
          io.sockets.emit('token', response);
        } else {
          if (data.select == 'stock') {
            const response = await chatQueryService.getStock();
            const stock = await chatDtoService.getStock(response);
            io.sockets.emit('stock_response', stock);
            io.sockets.emit('tokenSuccess', 'Succes');
          } else if (data.select == 'order') {
            const userToken = await userData.tokens[0];
            const response = await chatQueryService.getOrders(
              userToken.user.user_id
            );
            const order = await chatDtoService.getOrders(response);
            io.sockets.emit('order_response', order);
          } else if (data.select == 'cart') {
            const userToken = await userData.tokens[0];
            const cartInfo = await chatQueryService.getCart(
              userToken.user.user_id
            );
            const productInfo = await chatQueryService.getProducts();
            const response = await chatDtoService.getCart(
              cartInfo,
              productInfo
            );
            if (response.products.length == 0) {
              io.sockets.emit('cart_response_empty', 'The cart is empty');
            } else {
              io.sockets.emit('cart_response', response);
            }
          } else {
            loggerConsole.error('error');
          }
        }
      } catch (err) {
        loggerConsole.error(err);
      }
    });
  });
};
