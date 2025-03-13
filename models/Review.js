import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
