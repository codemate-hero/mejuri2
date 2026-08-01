import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const { name, lastName, email, password } = await req.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
  });

  return Response.json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      lastName: lastName
    },
  });
}