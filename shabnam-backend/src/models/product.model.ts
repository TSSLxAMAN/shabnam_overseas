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
          enum: ["2x3", "3x5", "4x6", "5x8", "6x9"], // fixed set
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
          enum: ["RED", "BLUE", "BEIGE", "GREEN", "GREY"],
          required: true,
        },
      },
    ],

    byType: {
      type: String,
      enum: ["HAND-KNOTTED", "HAND-TUFTED", "FLAT WEAVE", "DHURRIE", "KILIM"],
    },
    byRoom: {
      type: String,
      enum: ["LIVING ROOM", "BEDROOM", "DINING ROOM", "HALLWAY"],
    },
    style: {
      type: String,
      enum: ["MODERN", "TRADITIONAL", "BOHEMIAN", "MINIMALIST", "VINTAGE"],
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
