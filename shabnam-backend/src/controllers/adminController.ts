// import { Request, Response } from 'express';
// import Admin from '../models/Admin';
// import { generateToken } from '../utils/generateToken';
// import bcrypt from 'bcryptjs';

// // @desc    Login Admin
// export const loginAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });
//   if (admin && (await admin.matchPassword(password))) {
//     res.json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//       token: generateToken(admin._id),
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };

// // @desc    Superadmin creates another admin
// export const registerAdmin = async (req: Request, res: Response) => {
//   const { name, email, password, role } = req.body;

//   const existing = await Admin.findOne({ email });
//   if (existing) return res.status(400).json({ message: 'Admin already exists' });

//   const newAdmin = await Admin.create({ name, email, password, role });
//   res.status(201).json({
//     _id: newAdmin._id,
//     name: newAdmin.name,
//     email: newAdmin.email,
//     role: newAdmin.role,
//     token: generateToken(newAdmin._id),
//   });
// };

// controllers/adminController.ts

import { Request, Response } from 'express';
import Admin from '../models/Admin';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';

// @desc    Login Admin
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Superadmin creates another admin
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // console.log('Registering admin:', email);

  const existing = await Admin.findOne({ email });
  if (existing) {
    // console.log('Admin already exists.');
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const newAdmin = await Admin.create({ name, email, password, role });

  res.status(201).json({
    _id: newAdmin._id,
    name: newAdmin.name,
    email: newAdmin.email,
    role: newAdmin.role,
    token: generateToken(newAdmin._id.toString()),
  });
};
