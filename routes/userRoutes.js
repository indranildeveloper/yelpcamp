import express from "express";
import passport from "passport";
import { storeReturnUrl } from "../middlewares/storeReturnUrl.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLoginForm,
  renderRegisterForm,
} from "../controllers/userControllers.js";

const router = express.Router();

router.route("/register").get(renderRegisterForm).post(registerUser);

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    storeReturnUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    loginUser,
  );

router.get("/logout", logoutUser);

export default router;
