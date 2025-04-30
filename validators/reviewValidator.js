import Joi from "./Joi.js";

const reviewValidatorSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

export { reviewValidatorSchema };
