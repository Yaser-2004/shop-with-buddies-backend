import express from "express";
import Order from "../models/Order.js";
import Room from "../models/Room.js";
const router = express.Router();

/* POST /api/orders/checkout  */
router.post("/checkout", async (req, res) => {
  const { userId, roomCode, paymentMode, items, total } = req.body;

  try {
    /* 1. Create order */
    const order = await Order.create({ userId, paymentMode, items, total });

    /* 2. Clear cart */
    if (roomCode) {
      // shared cart
      await Room.updateOne({ roomCode }, { $set: { cart: [] } });
    } else {
      // personal cart — you may store it on User or separate collection
      // For demo, nothing to do server‑side
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, error: "Checkout failed" });
  }
});

// routes/orderRoutes.js  (add below checkout endpoint)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })    // newest first
      .populate("items.productId", "title image description");
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Cannot fetch orders" });
  }
});


export default router;
