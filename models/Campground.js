import mongoose from "mongoose";
import Review from "./Review.js";

const Schema = mongoose.Schema;

const CampgroundImageSchema = new Schema({
  url: String,
  fileName: String,
});

CampgroundImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const virtualOptions = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    images: {
      type: [CampgroundImageSchema],
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
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  virtualOptions,
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong>
    <a href="/campgrounds/${this._id}">${this.title}</a>
  </strong>
  <p>${this.description.substring(0, 20)}...</p>
  `;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

export default Campground;
