import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import adminRoutes from './routes/admin.routes'; // ✅ Consistent naming
import userRoutes from './routes/user.routes';
import authAdminRoutes from './routes/authAdmin.routes';
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from './routes/payment.routes';
import appointmentRoute from "./routes/appointment";
import customPageMailRoute from "./routes/customPageMail";  
import vipSignupRoute from "./routes/vipSignup";
import tradeRoutes from "./routes/trade.routes";
import filterRoutes from "./routes/filterRoutes";
import discountRoutes from "./routes/discount.routes";
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/appointment", appointmentRoute);
app.use("/api/custom-page-mail", customPageMailRoute);
app.use("/api/vip-signup", vipSignupRoute);
app.use("/api/trades", tradeRoutes);
// Example root route
app.get('/', (req, res) => {
  res.send('Welcome to Shabnam Overseas API!');
});
app.use("/api/filter", filterRoutes);
app.use("/api/discounts", discountRoutes); 
// 👇 Add this line
app.use('/api/admin', authAdminRoutes);

export default app;
