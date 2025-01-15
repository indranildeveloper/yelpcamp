import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import Campground from "./models/Campground.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();

  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
  console.log(`Server running on port: ${3000}`);
});
