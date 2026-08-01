import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

const USER_ID = "6a32f078c08c21e53c441956";

export async function GET() {
  await connectDB();

  const user = await User.findById(USER_ID).select("token").lean();

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  if (!user.token) {
    return Response.json({ message: "Token not found on user" }, { status: 404 });
  }

  return Response.json({ token: user.token });
}
