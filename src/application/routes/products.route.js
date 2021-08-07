const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const productController = require('../controllers/productController');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');

router.route('/:product_id').get(productController.getById);

router.route('/').get(productController.getAll);

router
  .route('/')
  .post(
    accessTokenValidator.verifyToken,
    accessTokenValidator.validateUserRole,
    productController.addProduct
  );

router
  .route('/:product_id')
  .put(
    accessTokenValidator.verifyToken,
    accessTokenValidator.validateUserRole,
    productController.updateProduct
  );

router
  .route('/:product_id')
  .delete(
    accessTokenValidator.verifyToken,
    accessTokenValidator.validateUserRole,
    productController.deleteProduct
  );

router.route('/find/:data').get(productController.getProductByFilter);

module.exports = router;
