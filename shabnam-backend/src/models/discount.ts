import { Schema, model, models } from "mongoose";
import { IDiscount, DiscountModel } from "../types/discount";

const discountSchema = new Schema<IDiscount, DiscountModel>({
  value: {
    type: Number,
    required: true,
    min: [0, "Discount cannot be less than 0"],
    max: [100, "Discount cannot be greater than 100"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default (models.Discount as DiscountModel) ||
  model<IDiscount, DiscountModel>("Discount", discountSchema);
