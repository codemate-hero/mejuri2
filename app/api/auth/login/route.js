import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
console.log("User found:", user);
  if (!user) {
    return Response.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return Response.json({
    message: "Login successful",
    token,
  });
}