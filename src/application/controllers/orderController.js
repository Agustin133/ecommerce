/* eslint-disable camelcase */
const orderService = require('../../domain/orderService');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');

async function getOrdersInProgress(req, res) {
  try {
    const response = await orderService.getOrdersInProgress();
    if (response.ERROR) {
      res.status(400).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getOrders(req, res) {
  try {
    const response = await orderService.getOrders();
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteOrder(req, res) {
  try {
    const order_id = req.params.order_id;
    const schema = Joi.number().required();
    joiValid(schema, order_id);
    const response = await orderService.deleteOrder(order_id);
    if (response.ERROR) {
      res.status(400).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function completeOrder(req, res) {
  try {
    const response = await orderService.completeOrder();
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
  getOrdersInProgress,
  getOrders,
  deleteOrder,
  completeOrder,
};
