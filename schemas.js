const Joi = require("Joi");

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});
