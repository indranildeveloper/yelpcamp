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

  for (let i = 0; i < 300; i++) {
    const randomThousand = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      title: `${pickRandomElement(descriptors)} ${pickRandomElement(places)}`,
      location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
      images: [
        {
          url: `https://cdn.pixabay.com/photo/2020/03/04/00/47/woods-4900188_1280.jpg`,
          fileName: crypto.randomUUID(),
        },
      ],
      author: "68110502d61d2b986dbb391b",
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomThousand].longitude,
          cities[randomThousand].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat efficitur tellus, non ullamcorper orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce dapibus varius velit. Donec tempor ipsum vel finibus cursus. Nullam euismod, magna ut faucibus fermentum, quam neque ornare ante, placerat tempor tortor sapien in nibh. Maecenas ultrices in elit sed gravida. Aliquam eget dui libero. Donec ac odio et enim tincidunt tincidunt. Praesent aliquam ullamcorper arcu in porta. Pellentesque ut neque velit.",
      price: randomPrice,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
