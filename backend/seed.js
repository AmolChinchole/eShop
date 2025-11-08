import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const products = [
  {
    name: "Stylish Watch",
    price: 1500,
    images: ["https://m.media-amazon.com/images/I/71cVOgvystL._SX679_.jpg"],
    description: "Premium wrist watch with leather strap",
    category: "Accessories"
  },
  {
    name: "Wireless Earbuds",
    price: 2000,
    images: ["https://m.media-amazon.com/images/I/61CGHv6kmWL._SX679_.jpg"],
    description: "High-quality sound and long battery life",
    category: "Electronics"
  },
  {
    name: "Smartphone Cover",
    price: 500,
    images: ["https://m.media-amazon.com/images/I/71c6XZcfgoL._SX679_.jpg"],
    description: "Protective silicone case for smartphones",
    category: "Accessories"
  },
  {
    name: "Women's Handbag",
    price: 2500,
    images: ["https://m.media-amazon.com/images/I/81-infxoQ+L._SY695_.jpg"],
    description: "Elegant leather handbag for daily use",
    category: "Fashion"
  },
  {
    name: "Smart Digital Watch",
    price: 3500,
    images: ["https://m.media-amazon.com/images/I/61ZjlBOp+rL._SX679_.jpg"],
    description: "Feature-rich smartwatch with health tracking",
    category: "Electronics"
  },
  {
    name: "Wireless Bluetooth Earbuds",
    price: 1800,
    images: ["https://m.media-amazon.com/images/I/51SYeAPoDzL._SX679_.jpg"],
    description: "True wireless earbuds with premium sound quality",
    category: "Electronics"
  },
  {
    name: "Women's Summer Dress",
    price: 1200,
    images: ["https://m.media-amazon.com/images/I/71pWN8thvyL._SY879_.jpg"],
    description: "Comfortable and stylish summer dress",
    category: "Fashion"
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Instead of deleting, update existing products to add images
    console.log("Updating existing products with image URLs...");
    
    // Update products that don't have images
    const productsWithoutImages = await Product.find({ 
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ]
    });
    
    console.log(`Found ${productsWithoutImages.length} products without images`);
    
    // Sample image URLs to use as defaults
    const sampleImages = [
      "https://m.media-amazon.com/images/I/71cVOgvystL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61CGHv6kmWL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71c6XZcfgoL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/81-infxoQ+L._SY695_.jpg",
      "https://m.media-amazon.com/images/I/61ZjlBOp+rL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51SYeAPoDzL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71pWN8thvyL._SY879_.jpg",
    ];
    
    // Update each product without images
    for (let i = 0; i < productsWithoutImages.length; i++) {
      const product = productsWithoutImages[i];
      const imageUrl = sampleImages[i % sampleImages.length];
      product.images = [imageUrl];
      await product.save();
      console.log(`Updated ${product.name} with image`);
    }
    
    console.log("✅ Updated all products with images");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
