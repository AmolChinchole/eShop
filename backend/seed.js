import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const products = [
  {
    name: "Stylish Watch",
    price: 1500,
    images: ["https://via.placeholder.com/150"],
    description: "Premium wrist watch with leather strap",
    category: "Accessories"
  },
  {
    name: "Wireless Earbuds",
    price: 2000,
    images: ["https://via.placeholder.com/150"],
    description: "High-quality sound and long battery life",
    category: "Electronics"
  },
  {
    name: "Smartphone Cover",
    price: 500,
    images: ["https://via.placeholder.com/150"],
    description: "Protective silicone case for smartphones",
    category: "Accessories"
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeded products");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
