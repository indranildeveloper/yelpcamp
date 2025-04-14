import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { validateReview } from "../middlewares/validateReview.js";
import { isReviewAuthor } from "../middlewares/isReviewAuthor.js";
import {
  createReview,
  deleteReview,
} from "../controllers/reviewControllers.js";

const router = express.Router({ mergeParams: true });

router.post("/", isAuthenticated, validateReview, createReview);

router.delete("/:reviewId", isAuthenticated, isReviewAuthor, deleteReview);

export default router;
