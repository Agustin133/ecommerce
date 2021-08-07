const userService = require('../../domain/userService');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const bcrypt = require('bcrypt');

async function logIn(req, res) {
  const data = {
    email: req.body.user.email,
    password: req.body.user.password,
  };
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8).max(20),
  });
  try {
    joiValid(schema, data);
    const response = await userService.logIn(data);
    if (response.ERROR) {
      res.status(401).send(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function register(req, res) {
  const data = {
    email: req.body.user.email,
    password: req.body.user.password,
    repeat_password: req.body.user.repeat_password,
    personal_details: {
      first_name: req.body.user.personal_details.first_name,
      last_name: req.body.user.personal_details.last_name,
      phone_number: req.body.user.personal_details.phone_number,
      admin: req.body.user.personal_details.admin,
      delivery_direction: {
        street: req.body.user.personal_details.delivery_direction.street,
        house_number:
          req.body.user.personal_details.delivery_direction.house_number,
        postal_code:
          req.body.user.personal_details.delivery_direction.postal_code,
        department:
          req.body.user.personal_details.delivery_direction.department,
        floor:
          req.body.user.personal_details.delivery_direction.direction_floor,
      },
    },
  };
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8).max(20),
    repeat_password: Joi.string()
      .required()
      .min(8)
      .max(20)
      .equal(data.password),
    personal_details: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone_number: Joi.number().required(),
      admin: Joi.boolean().optional(),
      delivery_direction: Joi.object().required().keys({
        street: Joi.string().required(),
        house_number: Joi.number().required(),
        postal_code: Joi.number().required(),
        department: Joi.number(),
        floor: Joi.number(),
      }),
    }),
  });
  try {
    joiValid(schema, data, true);
    const response = await userService.register(data);
    res.status(201).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
}

// ====================
async function password(req, res) {
  const hashPassword = bcrypt.hashSync(req.params.password, 10);
  res.json(hashPassword);
}
// =====================

module.exports = {
  logIn,
  register,
  password,
};
