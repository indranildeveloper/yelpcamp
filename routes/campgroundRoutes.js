import express from "express";
import { validateCampground } from "../middlewares/validateCampground.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import {
  createCampground,
  deleteCampground,
  editCampground,
  renderCampground,
  renderCampgrounds,
  renderEditCampgroundForm,
  renderNewCampgroundForm,
} from "../controllers/campgroundControllers.js";

const router = express.Router();

router
  .route("/")
  .get(renderCampgrounds)
  .post(isAuthenticated, validateCampground, createCampground);

router.get("/new", isAuthenticated, renderNewCampgroundForm);

router
  .route("/:id")
  .get(renderCampground)
  .put(isAuthenticated, isAuthorized, validateCampground, editCampground)
  .delete(isAuthenticated, isAuthorized, deleteCampground);

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthorized,
  renderEditCampgroundForm,
);

export default router;
