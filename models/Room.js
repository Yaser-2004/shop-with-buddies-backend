import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  productTitle: String,
  addedBy: String,
  quantity: { type: Number, default: 1 },
  votes: {
    up: [String],
    down: [String],
  }
}, { _id: false }); // prevents duplicate _id creation for embedded subdocs

const RoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  members: [String],
  cart: [CartItemSchema],
  createdAt: { type: Date, default: Date.now }
});

// ✅ Only export the Room model
const Room = mongoose.model('Room', RoomSchema);
export default Room;
