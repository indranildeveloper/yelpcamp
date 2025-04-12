import Review from "../models/Review.js";

export const isReviewAuthor = async (req, res, next) => {
  const { campgroundId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${campgroundId}`);
  }
  next();
};
