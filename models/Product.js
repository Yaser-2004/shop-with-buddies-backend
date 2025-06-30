import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  category: String,
  stock: Number
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
