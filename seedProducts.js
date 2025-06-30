import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js'; // ensure path is correct

dotenv.config();

const products = [
  {
    title: "Noise ColorFit Smartwatch",
    image: "https://m.media-amazon.com/images/I/61epn29QGGL._AC_UF1000,1000_QL80_.jpg",
    price: 2999,
    description: "Smartwatch with fitness tracking, heart rate monitor, and color display.",
    category: "Electronics",
    stock: 50
  },
  {
    title: "boAt Airdopes 141",
    image: "https://m.media-amazon.com/images/I/61KNJav3S9L._AC_UF1000,1000_QL80_.jpg",
    price: 1299,
    description: "True wireless earbuds with ENx and ASAP Charge support.",
    category: "Electronics",
    stock: 60
  },
  {
    title: "JBL Go 3 Portable Speaker",
    image: "https://m.media-amazon.com/images/I/71rXSVqET9L._AC_UF1000,1000_QL80_.jpg",
    price: 1999,
    description: "Waterproof Bluetooth speaker with deep bass.",
    category: "Electronics",
    stock: 35
  },
  {
    title: "Mi Power Bank 3i 10000mAh",
    image: "https://m.media-amazon.com/images/I/61tRjeC4sZL._AC_UF1000,1000_QL80_.jpg",
    price: 999,
    description: "Fast charging with dual input/output ports.",
    category: "Electronics",
    stock: 70
  },
  {
    title: "Men's Cotton T-Shirt (Black)",
    image: "https://m.media-amazon.com/images/I/51JUq+TfGGL._AC_UY1000_.jpg",
    price: 499,
    description: "Regular fit, 100% cotton, round neck T-shirt.",
    category: "Fashion",
    stock: 80
  },
  {
    title: "Campus Men's Running Shoes",
    image: "https://m.media-amazon.com/images/I/71PFiTw+RBL._AC_UY1000_.jpg",
    price: 1499,
    description: "Lightweight sports shoes for daily wear.",
    category: "Fashion",
    stock: 40
  },
  {
    title: "Fastrack Analog Watch",
    image: "https://m.media-amazon.com/images/I/61JGQu5I2pL._AC_UL1000_.jpg",
    price: 1999,
    description: "Trendy analog watch with leather strap.",
    category: "Fashion",
    stock: 25
  },
  {
    title: "Women's Handbag - Leatherette",
    image: "https://m.media-amazon.com/images/I/61wO3kzQ+ZL._AC_UL1000_.jpg",
    price: 1599,
    description: "Stylish and spacious handbag for women.",
    category: "Fashion",
    stock: 45
  },
  {
    title: "Milton Thermosteel Flask 1L",
    image: "https://m.media-amazon.com/images/I/61Sox7QmJjL._AC_UL1000_.jpg",
    price: 749,
    description: "Keeps drinks hot/cold for 24 hours.",
    category: "Home",
    stock: 30
  },
  {
    title: "Cotton Bedsheet King Size",
    image: "https://m.media-amazon.com/images/I/91fpwTK2YEL._AC_UL1000_.jpg",
    price: 899,
    description: "Soft cotton bedsheet with 2 pillow covers.",
    category: "Home",
    stock: 50
  },
  {
    title: "Cello Plastic Bottle Set (6 Pcs)",
    image: "https://m.media-amazon.com/images/I/71QqHbWbt2L._AC_UL1000_.jpg",
    price: 499,
    description: "Leak-proof, BPA-free plastic water bottles.",
    category: "Home",
    stock: 60
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.insertMany(products);
    console.log('✅ Products inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seed();
