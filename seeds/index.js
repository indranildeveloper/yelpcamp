import mongoose from "mongoose";
import Campground from "../models/Campground.js";
import { cities } from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected...");
});

const pickRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const randomThousand = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${pickRandomElement(descriptors)} ${pickRandomElement(places)}`,
      location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
