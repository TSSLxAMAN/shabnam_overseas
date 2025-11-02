import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

interface ICartItem {
  product:
    | mongoose.Schema.Types.ObjectId
    | {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
        price: number;
      };
  size: string;
  color: string;
  quantity: number;
  price: number; // ✅ Added price field to store final discounted price
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  wishlist: mongoose.Types.ObjectId[];
  cart: ICartItem[];
  role: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // In user.model.ts
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: { type: String }, // ✅ add this
        color: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    role: { type: String, enum: ["user", "trader", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
