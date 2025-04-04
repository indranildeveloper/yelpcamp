import express from "express";
import asyncHandler from "../utils/expressAsyncHandler.js";
import Campground from "../models/Campground.js";
import { validateCampground } from "../middlewares/validateCampground.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }),
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  asyncHandler(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews",
    );
    res.render("campgrounds/show", { campground });
  }),
);

router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  }),
);

router.put(
  "/:id",
  validateCampground,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });

    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  }),
);

export default router;
