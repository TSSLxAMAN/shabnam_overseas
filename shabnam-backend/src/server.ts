// server.ts
import dotenv from "dotenv";
dotenv.config(); // ✅ Load env FIRST

import connectDB from "./config/db";
connectDB();

import app from "./app";
import productRoutes from "./routes/product.routes";
import adminRoutes from "./routes/admin.routes";
import categoryRoutes from "./routes/categoryRoutes";

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
