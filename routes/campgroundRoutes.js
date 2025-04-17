import express from "express";
import multer from "multer";
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
import { storage } from "../cloudinary/cloudinary.js";

const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .get(renderCampgrounds)
  .post(
    isAuthenticated,
    upload.array("image"),
    validateCampground,
    createCampground,
  );

router.get("/new", isAuthenticated, renderNewCampgroundForm);

router
  .route("/:id")
  .get(renderCampground)
  .put(
    isAuthenticated,
    isAuthorized,
    upload.array("image"),
    validateCampground,
    editCampground,
  )
  .delete(isAuthenticated, isAuthorized, deleteCampground);

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthorized,
  renderEditCampgroundForm,
);

export default router;
