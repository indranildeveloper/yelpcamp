import Joi from "joi";

const reviewValidatorSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
});

export { reviewValidatorSchema };
