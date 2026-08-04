import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

const USER_ID = "6a32f078c08c21e53c441956";

export async function GET() {
  await connectDB();

  let user = await User.findById(USER_ID).lean();

  if (!user) {
    user = await User.create({
      _id: USER_ID,
      email: "system@mejuri.local",
      role: "user",
    });
  }

  if (!user.token) {
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email || "system@mejuri.local" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user = await User.findByIdAndUpdate(
      USER_ID,
      { token },
      { new: true, upsert: true }
    ).lean();
  }

  return Response.json({ token: user.token });
}
