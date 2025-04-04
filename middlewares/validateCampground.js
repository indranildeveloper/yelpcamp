import { campgroundValidatorSchema } from "../validators/campgroundValidator.js";
import ExpressError from "../utils/ExpressError.js";

export const validateCampground = (req, res, next) => {
  const { error } = campgroundValidatorSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
