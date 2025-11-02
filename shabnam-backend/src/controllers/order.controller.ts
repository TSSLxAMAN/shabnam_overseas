import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/order.model';

interface IUser {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
}

interface IAdmin {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
}

// Properly extend the Request interface
interface AuthRequest extends Request {
  user?: IUser;
  admin?: IAdmin;
}


// 👉 POST /api/orders — Create Order
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      mobileNumber,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
      return;
    }

    // Check if either user or admin is authenticated
    if ((!req.user || !req.user._id) && (!req.admin || !req.admin._id)) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const orderItemsWithObjectId = orderItems.map((item: any) => ({
      ...item,
      product: new mongoose.Types.ObjectId(item.product),
    }));

    // Determine who is placing the order
    const orderData: any = {
      orderItems: orderItemsWithObjectId,
      shippingAddress,
      mobileNumber,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    }

    if (req.admin && req.admin._id) {
      orderData.admin = req.admin._id;
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
);

// 👉 GET /api/orders/myorders — User's Orders
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  }
);

// 👉 GET /api/orders — All Orders (Admin only)
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    // return recent first
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  }
);

// 👉 GET /api/orders/:id — Single Order (Admin only)
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('admin', 'name email');

  if (order) res.json(order);
  else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// 👉 PUT /api/orders/:id/deliver — Mark as Delivered
// export const markOrderAsDelivered = asyncHandler(async (req: Request, res: Response) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = new Date();
//     const updated = await order.save();
//     res.json(updated);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });


// ✅ Fixed: markOrderAsDelivered without triggering full validation
export const markOrderAsDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  }
);


// 👉 PUT /api/orders/:id/pay — Mark as Paid
// export const markOrderAsPaid = asyncHandler(async (req: Request, res: Response) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isPaid = true;
//     order.paidAt = new Date();
//     const updated = await order.save();
//     res.json(updated);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });


// ✅ markOrderAsPaid (Admin)
export const markOrderAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.id;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      paidAt: new Date(),
    },
    { new: true, runValidators: false } // 🔐 Skip validation for required fields like itemsPrice
  );

  if (!updatedOrder) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  res.json(updatedOrder);
});

