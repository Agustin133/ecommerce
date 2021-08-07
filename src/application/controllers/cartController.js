const cartService = require('../../domain/cartService');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');

async function getCart(req, res) {
  try {
    const response = await cartService.getCart();
    res.json(response);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function addProduct(req, res) {
  try {
    const body = req.body;
    const schema = Joi.object().required().keys({
      product_id: Joi.number().required(),
      quantity: Joi.number().required(),
    });
    joiValid(schema, body);
    const response = await cartService.addProduct(body);
    if (response.ERROR) {
      res.status(400).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteProduct(req, res) {
  try {
    const body = req.body;
    const schema = Joi.object().required().keys({
      product_id: Joi.number().required(),
      quantity: Joi.number().required(),
    });
    joiValid(schema, body);
    const response = await cartService.deleteProduct(body);
    if (response.ERROR) {
      res.status(400).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function submitCart(req, res) {
  try {
    const response = await cartService.submitCart();
    if (response.ERROR) {
      res.status(400).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = {
  getCart,
  addProduct,
  deleteProduct,
  submitCart,
};
