const Joi = require("Joi");

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    name: Joi.string().required(),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
