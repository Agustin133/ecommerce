const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const cartController = require('../controllers/cartController');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');

router.route('/').get(accessTokenValidator.verifyToken, cartController.getCart);

router
  .route('/add')
  .post(accessTokenValidator.verifyToken, cartController.addProduct);

router
  .route('/delete')
  .post(accessTokenValidator.verifyToken, cartController.deleteProduct);

router
  .route('/submit')
  .post(accessTokenValidator.verifyToken, cartController.submitCart);

module.exports = router;
