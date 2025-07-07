import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // <- this is required
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: { type: Number, default: 1 },
  votes: {
    up: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { _id: false }); // prevents duplicate _id creation for embedded subdocs

const RoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  host: {
    type: mongoose.Schema.Types.ObjectId, // Or just `String` if you're using email or username
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  cart: [CartItemSchema],
  createdAt: { type: Date, default: Date.now }
});

// ✅ Only export the Room model
const Room = mongoose.model('Room', RoomSchema);
export default Room;
