import express from "express";
import passport from "passport";
import User from "../models/User.js";
import asyncHandler from "../utils/expressAsyncHandler.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (error) => {
        if (error) {
          return next(error);
        } else {
          req.flash("success", "Welcome to Yelp Camp!");
          res.redirect("/campgrounds");
        }
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  },
);

router.get("/logout", (req, res, next) => {
  req.logOut(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

export default router;
