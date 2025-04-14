import Campground from "../models/Campground.js";
import Review from "../models/Review.js";
import asyncHandler from "../utils/expressAsyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { campgroundId } = req.params;
  const campground = await Campground.findById(campgroundId);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully created a new review!");
  res.redirect(`/campgrounds/${campground._id}`);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { campgroundId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(campgroundId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/campgrounds/${campgroundId}`);
});
