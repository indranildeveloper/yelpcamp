import mapboxGeocodingClient from "@mapbox/mapbox-sdk/services/geocoding.js";
import Campground from "../models/Campground.js";
import asyncHandler from "../utils/expressAsyncHandler.js";
import { cloudinary } from "../cloudinary/cloudinary.js";

const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocodingClient({ accessToken: mapboxToken });

export const renderCampgrounds = asyncHandler(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

export const renderNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

export const createCampground = asyncHandler(async (req, res) => {
  const geocodingData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const campground = new Campground(req.body.campground);
  campground.geometry = geocodingData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    fileName: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully created a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

export const renderCampground = asyncHandler(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find the campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

export const renderEditCampgroundForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

export const editCampground = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    fileName: file.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let fileName of req.body.deleteImages) {
      await cloudinary.uploader.destroy(fileName);
    }
    await campground.updateOne({
      $pull: { images: { fileName: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

export const deleteCampground = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
});
