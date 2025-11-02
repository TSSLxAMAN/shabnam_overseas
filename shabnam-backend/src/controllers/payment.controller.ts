import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      mobileNumber,
      itemsPrice,
      totalPrice,
      userId,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order items" });
    }

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in DB with pending payment
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      mobileNumber,
      paymentMethod: "Razorpay",
      itemsPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice,
      isPaid: false,
    });

    res.json({
      success: true,
      razorpayOrder,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order in DB
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: razorpay_payment_id,
          status: "paid",
          update_time: new Date().toISOString(),
        },
      });

      res.json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};
