import asyncHandler from "../utils/expressAsyncHandler.js";
import User from "../models/User.js";

export const renderRegisterForm = (req, res) => {
  res.render("users/register");
};

export const registerUser = asyncHandler(async (req, res, next) => {
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
});

export const renderLoginForm = (req, res) => {
  res.render("users/login");
};

export const loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

export const logoutUser = (req, res, next) => {
  req.logOut(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
