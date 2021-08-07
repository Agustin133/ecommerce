const express = require('express');
const router = new express.Router();
const productsRoute = require('./products.route');
const cartRoute = require('./carts.route');
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const imageRoute = require('./image.route');

router.use('/api/image', imageRoute);
router.use('/api/products', productsRoute);
router.use('/api/cart', cartRoute);
router.use('/api/user', userRoute);
router.use('/api/orders', orderRoute);

module.exports = router;
