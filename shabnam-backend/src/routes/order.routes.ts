// import express from 'express';
// import {
//   registerAdmin,
//   loginAdmin,
//   getAllOrders,
//   getOrderById,
//   markOrderAsDelivered,
// } from '../controllers/admin.controller';
// import { protect } from '../middleware/auth.middleware';
// import { protectAdmin } from '../middleware/protectAdmin';

// const router = express.Router();

// // Public routes
// router.post('/register', registerAdmin);
// router.post('/login', loginAdmin);

// // Test protected route with JWT
// router.get('/protected', protect, (req, res) => {
//   res.json({ message: '✅ Protected route access granted!' });
// });

// // Protected admin order routes
// router.use(protectAdmin);
// router.get('/orders', getAllOrders);
// router.get('/orders/:id', getOrderById);
// router.put('/orders/:id/deliver', markOrderAsDelivered);

// export default router;




import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';     // for users
import { protectAdmin } from '../middleware/authMiddleware';   // for admins

const router = express.Router();

// 👉 User routes
router.post('/', protect, createOrder);            // place order
router.get('/myorders', protect, getMyOrders);     // user's order history

// 👉 Admin routes
router.get('/:id', protectAdmin, getOrderById);                      // single order
router.put('/:id/deliver', protectAdmin, markOrderAsDelivered);     // mark as delivered
router.put('/:id/pay', protectAdmin, markOrderAsPaid);              // mark as paid

export default router;
