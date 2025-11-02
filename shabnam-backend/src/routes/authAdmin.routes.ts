import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin.controller';

const router = express.Router();

// 🟩 Login and Register routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

export default router;
