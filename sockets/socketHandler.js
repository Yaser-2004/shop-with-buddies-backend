import mongoose from 'mongoose';
import Room from '../models/Room.js';
import User from '../models/User.js';

const checkoutConfirmations = {}; // { [roomCode]: { [userId]: true/false } }

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // JOIN ROOM
    // sockets/socketHandler.js
    socket.on("join-room", async ({ roomCode, userId }) => {
      try {
        // convert to ObjectId once so type is always consistent
        const uid = new mongoose.Types.ObjectId(userId);

        // add only if not present
        const room = await Room.findOneAndUpdate(
          { roomCode },
          { $addToSet: { members: uid } },   // <-- magic line
          { new: true }                      // return updated doc
        ).populate("members", "-password");   // optional populate

        if (!room) {
          return socket.emit("error", { message: "Room not found" });
        }

        // Emit the joined user to others (exclude password field)
        const user = await User.findById(uid).select("-password");
        // Finally join the actual socket room
        socket.join(roomCode);
        socket.to(roomCode).emit("user-joined", { user });


      } catch (err) {
        console.error("Error joining room:", err);
      }
    });


    // ADD TO CART
    socket.on('add-to-shared-cart', async ({ roomCode, item }) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (!room) {
          console.error("Room not found:", roomCode);
          return;
        }

        const existingItem = room.cart.find(cartItem =>
          cartItem.productId.toString() === item.productId
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          room.cart.push({
            productId: item.productId,
            addedBy: item.addedBy, // user._id
            quantity: 1,
            votes: { up: [], down: [] }
          });
        }

        await room.save();

        // ✅ Re-fetch and populate cart with product details
        const updatedRoom = await Room.findOne({ roomCode }).populate('cart.productId');

        // Flatten cart to return product details directly
        const populatedCart = updatedRoom.cart.map(cartItem => ({
          _id: cartItem._id,
          quantity: cartItem.quantity,
          addedBy: cartItem.addedBy,
          votes: cartItem.votes,
          productId: cartItem.productId._id,
          title: cartItem.productId.title,
          price: cartItem.productId.price,
          image: cartItem.productId.image,
          description: cartItem.productId.description
        }));

        io.to(roomCode).emit('cart-updated', populatedCart);

      } catch (err) {
        console.error("Error adding item to shared cart:", err);
      }
    });


    // HOVERED PRODUCT
    socket.on('hover-product', ({ roomCode, user, productName }) => {
      socket.to(roomCode).emit('user-hovered', { user, productName });
    });

    // CHAT MESSAGE
    socket.on('send-message', ({ roomCode, message }) => {
        console.log(`Received message for room ${roomCode}:`, message);
      socket.to(roomCode).emit('receive-message', message);
    });

    socket.on('leave-room', async ({ roomCode, userId }) => {
      socket.leave(roomCode);
      console.log(`${userId} left ${roomCode}`);

      try {
        const room = await Room.findOne({ roomCode });

        if (!room) return;

        // Remove the userId from members
        room.members = room.members.filter(
          memberId => memberId.toString() !== userId
        );

        await room.save();

        // Notify others in the room
        socket.to(roomCode).emit('user-left', { userId });
      } catch (err) {
        console.error("Error removing user from room:", err);
      }
    });

    socket.on('end-room', (roomCode) => {
      io.to(roomCode).emit('room-ended');
      io.socketsLeave(roomCode); // disconnect all from room
    });

    socket.on('start-agora-call', ({ roomCode, token, channelName, fromUser }) => {
      console.log(`📞 Agora call started in room ${roomCode} by user ${fromUser}`);

      // Notify everyone else in the room
      socket.to(roomCode).emit('incoming-agora-call', {
        token,
        channelName,
        fromUser, // optional: used for UI to show caller's name
      });
    });

    socket.on("focus-product", ({ roomCode, productId, sender }) => {
      // Broadcast to others in the room
      socket.to(roomCode).emit("focus-product", { productId, sender });
    });

    socket.on("checkout-confirm", ({ roomCode, userId }) => {
      if (!checkoutConfirmations[roomCode]) {
        checkoutConfirmations[roomCode] = {};
      }

      checkoutConfirmations[roomCode][userId] = true;

      Room.findOne({ roomCode }).then(room => {
        if (!room) return;

        const allConfirmed = room.members.every(memberId =>
          checkoutConfirmations[roomCode][memberId.toString()]
        );

        if (allConfirmed) {
          io.to(roomCode).emit("all-users-confirmed-checkout");

          // ✅ Optionally reset after confirmation
          delete checkoutConfirmations[roomCode];
        }
      });
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
