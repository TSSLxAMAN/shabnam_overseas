import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Discount ||
  mongoose.model("Discount", discountSchema);
