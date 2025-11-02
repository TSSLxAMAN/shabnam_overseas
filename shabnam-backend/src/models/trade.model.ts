import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITrade extends Document {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  isApproved: boolean;
  tradeStatus: "pending" | "approved" | "rejected";
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const tradeSchema: Schema<ITrade> = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    companyName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 50 },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    tradeStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
tradeSchema.pre("save", async function (next) {
  const trade = this as ITrade;

  if (!trade.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    trade.password = await bcrypt.hash(trade.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// 🔑 Add method to compare passwords
tradeSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
tradeSchema.index({ email: 1 });
tradeSchema.index({ companyName: 1 });
tradeSchema.index({ tradeStatus: 1 });

const Trade = mongoose.model<ITrade>("Trade", tradeSchema);
export default Trade;
