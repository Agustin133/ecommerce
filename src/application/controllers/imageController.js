/* eslint-disable camelcase */
const imageService = require('../../domain/imageService');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');

async function addImage(req, res) {
  try {
    const body = req.body;
    const schema = Joi.object().required().keys({
      product_id: Joi.number().required(),
      file: Joi.string().required(),
    });
    joiValid(schema, body);
    const response = await imageService.addImage(body);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.status(201).send(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getImage(req, res) {
  try {
    const product_id = req.params.product_id;
    const schema = Joi.number().required();
    joiValid(schema, product_id);
    const response = await imageService.getImages(product_id);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteImage(req, res) {
  try {
    const image_id = req.params.image_id;
    const schema = Joi.number().required();
    joiValid(schema, image_id);
    const response = await imageService.deleteImage(image_id);
    if (response.ERROR) {
      res.status(404).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = {
  addImage,
  getImage,
  deleteImage,
};
