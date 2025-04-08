import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoose from "mongoose";
import flash from "connect-flash";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import ExpressError from "../utils/ExpressError.js";
import campgroundRoutes from "../routes/campgroundRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import { flashMessage } from "../middlewares/flashMessage.js";
import { getCurrentUser } from "../middlewares/getCurrentUser.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

const sessionOptions = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(flashMessage);
app.use(getCurrentUser);

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:campgroundId/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeuser", async (req, res) => {
  const user = new User({
    email: "john@gmail.com",
    username: "john",
  });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No! Something went wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Server running on port: ${3000}`);
});
