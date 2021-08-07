/* eslint-disable camelcase */
const productService = require('../../domain/productService');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');

async function getById(req, res) {
  try {
    const product_id = req.params.product_id;
    const schema = Joi.number().required();
    joiValid(schema, product_id);
    const response = await productService.getProductById(product_id);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getAll(req, res) {
  try {
    const response = await productService.getAll();
    res.json(response);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function addProduct(req, res) {
  try {
    const body = req.body;
    const schema = Joi.object().required().keys({
      title: Joi.string().required(),
      price: Joi.number().required(),
      stock: Joi.number().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
    });
    joiValid(schema, body);
    const response = await productService.addProduct(body);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function updateProduct(req, res) {
  try {
    const data = {
      body: req.body,
      product_id: req.params.product_id,
    };
    const schema = Joi.object()
      .required()
      .keys({
        product_id: Joi.number().required(),
        body: Joi.object().required().keys({
          title: Joi.string().required(),
          price: Joi.number().required(),
          stock: Joi.number().required(),
          description: Joi.string().required(),
          category: Joi.string().required(),
        }),
      });
    joiValid(schema, data);
    const response = await productService.updateProduct(data);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteProduct(req, res) {
  try {
    const product_id = req.params.product_id;
    const schema = Joi.number().required();
    joiValid(schema, product_id);
    const response = await productService.deleteProduct(product_id);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send({
      ERROR: 'Bad request',
    });
  }
}

async function getProductByFilter(req, res) {
  try {
    const data = req.params.data;
    const schema = Joi.string().required();
    joiValid(schema, data);
    const response = await productService.getProductByFilter(data);
    res.json(response);
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = {
  getById,
  getAll,
  addProduct,
  updateProduct,
  getProductByFilter,
  deleteProduct,
};
