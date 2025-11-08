import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: {
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        qty: { type: Number, default: 1 },
        price: Number,
        image: String
      }
    ],
    default: []
  },
  isAdmin: { type: Boolean, default: false }
  ,
  // Fields for email OTP login
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

// Password hash before save
userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
