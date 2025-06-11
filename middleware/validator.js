const Joi = require("joi");

 const registerUserValidator = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().required(),
className: Joi.string().required(),

});
module.exports = { registerUserValidator };
