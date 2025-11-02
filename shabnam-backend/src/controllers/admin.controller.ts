import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin';
import Order from '../models/order.model';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';


// ✅ GET Admin Profile
export const getAdminProfile = async (req: any, res: Response) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json({
    _id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
  });
};

interface UpdateAdminRequest extends Request {
  params: {
    id: string;
  };
  body: {
    name?: string;
    email?: string;
    role?: string;
  };
}

// 🟩 Admin Login (with debug logs)
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body)
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials (email)' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (isMatch) {
    return res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id.toString()),
    });
  } else {
    return res.status(401).json({ message: 'Invalid credentials (password)' });
  }
};


// 🟩 Superadmin creates new Admin
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // ✅ Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);


  const newAdmin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    _id: newAdmin._id,
    name: newAdmin.name,
    email: newAdmin.email,
    role: newAdmin.role,
    token: generateToken(newAdmin._id.toString()),
  });
};




// 🧾 GET all orders - Admin only
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('admin', 'email');
  res.json(orders);
});

// 📦 GET order by ID - Admin only
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price image");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// ✅ Mark order as delivered - Admin only
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});



// // 🔽 GET all admins (superadmin only)
// export const getAllAdmins = asyncHandler(async (req: Request, res: Response) => {
//   const admins = await Admin.find({}, '-password')
//   res.json(admins)
// })

// ✅ Get all admins (superadmin only)
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find().select('-password') // Hide passwords
    res.json(admins)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch admins' })
  }
}

// ✏️ UPDATE admin role/email
export const updateAdminById = asyncHandler(
  async (req: UpdateAdminRequest, res: Response) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    const { name, email, role } = req.body;
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    });
  }
);

// Also fix the delete function with the same pattern
interface DeleteAdminRequest extends Request {
  params: {
    id: string;
  };
}

// ❌ DELETE admin - FIXED VERSION
export const deleteAdminById = asyncHandler(
  async (req: DeleteAdminRequest, res: Response) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    await admin.deleteOne();
    res.json({ message: "Admin deleted" });
  }
);
