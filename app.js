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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap Camping!",
  });

  await camp.save();

  res.send(camp);
});

app.listen(3000, () => {
  console.log(`Server running on port: ${3000}`);
});
