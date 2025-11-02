import { Document, Model } from "mongoose";

export interface IDiscount extends Document {
  value: number;
  createdAt: Date;
}

export interface DiscountModel extends Model<IDiscount> {}

// More flexible response type that allows optional message
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
