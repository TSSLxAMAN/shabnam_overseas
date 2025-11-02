import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import Product from "../models/product.model";
import Discount from "../models/discount";

export const addToCart = asyncHandler(async (req: any, res) => {
  const { productId, selectedSize, selectedColor, quantity } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const selectedSizeObj = product.sizes.find((s) => s.label === selectedSize);
  if (!selectedSizeObj) {
    res.status(400);
    throw new Error("Invalid size selected");
  }

  if (selectedSizeObj.stock < quantity) {
    res.status(400);
    throw new Error("Not enough stock");
  }

  const qty = Number(quantity) || 1;
  if (qty < 1) {
    res.status(400);
    throw new Error("Quantity must be >= 1");
  }

  // ✅ Base price for this size (original product price)
  const basePrice = selectedSizeObj.price;
  let finalPrice = basePrice;
  let appliedDiscount = 0;

  // ✅ Apply discount if user is trader
  if (user.role === "trader") {
    try {
      const discountDocs = await Discount.find()
        .sort({ createdAt: -1 })
        .limit(1);
      const discount = discountDocs.length > 0 ? discountDocs[0].value : 0;

      if (discount > 0 && discount <= 100) {
        // validate discount is reasonable
        appliedDiscount = discount;
        finalPrice = basePrice - (basePrice * discount) / 100;
        // Round to 2 decimal places to avoid floating point issues
        finalPrice = Math.round(finalPrice * 100) / 100;
      }
    } catch (error) {
      console.error("Error fetching discount:", error);
      // If discount fetch fails, use original price
    }
  }

  // ✅ Check if already in cart (don't compare price to avoid floating point issues)
  const existingIndex = user.cart.findIndex(
    (item: any) =>
      item.product.toString() === productId &&
      item.size === selectedSize &&
      item.color === selectedColor
  );

  if (existingIndex !== -1) {
    // Update existing item
    user.cart[existingIndex].quantity += qty;
    user.cart[existingIndex].price = finalPrice; // ✅ update price in case discount changed
  } else {
    // Add new item to cart
    user.cart.push({
      product: productId,
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
      price: finalPrice, // ✅ save discounted price
    });
  }

  await user.save();

  // ✅ Optional: Return additional info about discount applied
  res.json({
    cart: user.cart,
    appliedDiscount: user.role === "trader" ? appliedDiscount : 0,
    message:
      user.role === "trader" && appliedDiscount > 0
        ? `Trader discount of ${appliedDiscount}% applied`
        : "Added to cart",
  });
});

// @desc Remove from cart
// @route DELETE /api/cart/:productId
// @access Private
export const removeFromCart = asyncHandler(async (req: any, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cart = user.cart.filter(
    (item: any) => item.product.toString() !== productId
  );

  await user.save();
  res.status(200).json({ message: "Product removed from cart" });
});

// @desc Get cart
// @route GET /api/cart
// @access Private
export const getCart = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user.cart);
});

// @desc Update quantity for a product already in the cart
// @route PUT /api/cart/:productId
// @access Private
export const updateCartQuantity = asyncHandler(async (req: any, res) => {
  const { productId } = req.params;
  const qtyNum = Number(req.body?.quantity);

  if (!qtyNum || isNaN(qtyNum) || qtyNum < 1) {
    res.status(400);
    throw new Error("Quantity must be a number >= 1");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const item = user.cart.find((it: any) => it.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  item.quantity = qtyNum;
  await user.save();

  // Optionally repopulate to mirror getCart; not required by your frontend
  await user.populate("cart.product");

  // Keep your existing shape to avoid frontend changes
  res.json({ message: "Quantity updated", cart: user.cart });
});

// @desc Clear cart
// @route DELETE /api/cart
// @access Private
export const clearCart = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cart = [];
  await user.save();

  res.json({ message: "Cart cleared" });
});
