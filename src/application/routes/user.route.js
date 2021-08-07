const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/login').post(userController.logIn);

router.route('/register').post(userController.register);

router.route('/password/:password').get(userController.password);

module.exports = router;
