const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),   // fixed typo
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.object({                     // match mongoose structure
      filename: Joi.string().allow("", null),
      url: Joi.string().allow("", null)
    }).optional()
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required(),
});
