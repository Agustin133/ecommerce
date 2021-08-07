const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const imageController = require('../controllers/imageController');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');

router
  .route('/')
  .post(
    accessTokenValidator.verifyToken,
    accessTokenValidator.validateUserRole,
    imageController.addImage
  );

router.route('/:product_id').get(imageController.getImage);

router
  .route('/:image_id')
  .delete(
    accessTokenValidator.verifyToken,
    accessTokenValidator.validateUserRole,
    imageController.deleteImage
  );

module.exports = router;
