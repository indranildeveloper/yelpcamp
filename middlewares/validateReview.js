import { reviewValidatorSchema } from "../validators/reviewValidator.js";
import ExpressError from "../utils/ExpressError.js";

export const validateReview = (req, res, next) => {
  const { error } = reviewValidatorSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
