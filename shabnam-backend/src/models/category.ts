import mongoose, { Document, Schema } from "mongoose";

export type CategoryType = "size" | "style" | "type" | "room" | "color";

export interface ICategory extends Document {
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["size", "style", "type", "room", "color"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
