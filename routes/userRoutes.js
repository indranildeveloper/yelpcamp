import express from "express";
import passport from "passport";
import User from "../models/User.js";
import asyncHandler from "../utils/expressAsyncHandler.js";
import { storeReturnUrl } from "../middlewares/storeReturnUrl.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLoginForm,
  renderRegisterForm,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/register", renderRegisterForm);

router.post("/register", registerUser);

router.get("/login", renderLoginForm);

router.post(
  "/login",
  storeReturnUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  loginUser,
);

router.get("/logout", logoutUser);

export default router;
