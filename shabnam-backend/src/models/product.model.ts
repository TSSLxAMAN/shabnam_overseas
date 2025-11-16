import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: [{ type: String, required: true }],

    category: String,

    // ✅ Sizes (with fixed allowed labels)
    sizes: [
      {
        label: {
          type: String,

          required: true,
        },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
      },
    ],

    // ✅ Colors as multiple choices
    colors: [
      {
        label: {
          type: String,
          required: true,
        },
      },
    ],

    byType: {
      type: String,
    },
    byRoom: {
      type: String,
    },
    style: {
      type: String,
    },
    dimensions: {
      type: String,
      trim: true,
      default: "",
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    careInformation: {
      type: String,
      trim: true,
      default: "",
    },
    additionalDetails: {
      type: String,
      trim: true,
      default: "",
    },
    shippingReturns: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
