import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ isAdmin: false }, { status: 401 });
  }

  try {
    const token = authHeader.slice("Bearer ".length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return Response.json({ isAdmin: false }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("role").lean();

    if (!user || user.role !== "admin") {
      return Response.json({ isAdmin: false }, { status: 403 });
    }

    return Response.json({ isAdmin: true });
  } catch {
    return Response.json({ isAdmin: false }, { status: 401 });
  }
}
