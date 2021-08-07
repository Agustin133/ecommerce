const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const orderController = require('../controllers/orderController');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');

router
  .route('/in_progres')
  .get(accessTokenValidator.verifyToken, orderController.getOrdersInProgress);

router
  .route('/')
  .get(accessTokenValidator.verifyToken, orderController.getOrders);

router
  .route('/:order_id')
  .delete(accessTokenValidator.verifyToken, orderController.deleteOrder);

router
  .route('/complete')
  .post(accessTokenValidator.verifyToken, orderController.completeOrder);

module.exports = router;
