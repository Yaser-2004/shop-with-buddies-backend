import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity:  Number,
    price:     Number
  }],
  paymentMode: { type: String, enum: ["individual", "split"], required: true },
  total:       Number,
  createdAt:   { type: Date, default: Date.now }
});
export default mongoose.model("Order", OrderSchema);
