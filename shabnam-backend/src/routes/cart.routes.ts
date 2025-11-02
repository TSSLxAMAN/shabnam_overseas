// import express from "express";
// import { protect } from "../middleware/authMiddleware";
// import {
//   addToCart,
//   clearCart,
//   getCart,
//   removeFromCart,
// } from "../controllers/cart.controller";

// const router = express.Router();

// router.post("/", protect, addToCart); 
// router.get("/", protect, getCart);
// router.delete("/", protect, clearCart);
// router.delete("/:productId", protect, removeFromCart);

// export default router;




import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity, // ✅ wire this in
} from "../controllers/cart.controller";

const router = express.Router();

// Mount this router at /api/cart in app.ts: app.use("/api/cart", router)

router.post("/", protect, addToCart);
router.get("/", protect, getCart);

// ✅ NEW: update quantity (matches your frontend: PUT /api/cart/:productId)
router.put("/:productId", protect, updateCartQuantity);

router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
