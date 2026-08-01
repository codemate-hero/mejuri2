import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    token: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    dateOfBirth: Date
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);