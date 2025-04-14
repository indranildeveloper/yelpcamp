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

router.get("/", renderCampgrounds);

router.get("/new", isAuthenticated, renderNewCampgroundForm);

router.post("/", isAuthenticated, validateCampground, createCampground);

router.get("/:id", renderCampground);

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthorized,
  renderEditCampgroundForm,
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  validateCampground,
  editCampground,
);

router.delete("/:id", isAuthenticated, isAuthorized, deleteCampground);

export default router;
