import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
});

const Campground = mongoose.model("Campground", CampgroundSchema);

export default Campground;
