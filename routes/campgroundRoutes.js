import express from "express";
import asyncHandler from "../utils/expressAsyncHandler.js";
import Campground from "../models/Campground.js";
import { validateCampground } from "../middlewares/validateCampground.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";

const router = express.Router();

router.get("/new", isAuthenticated, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isAuthenticated,
  validateCampground,
  asyncHandler(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find the campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  }),
);

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find the campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  }),
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  validateCampground,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }),
);

export default router;
