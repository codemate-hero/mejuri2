import jwt from "jsonwebtoken";
import { getUserIpFromRequest } from "./getUserIp";

export function resolveShoppingUserIdentity(req) {
  const userIp = getUserIpFromRequest(req);
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      userId: userIp || "guest",
      userIp,
      isAuthenticated: false,
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return {
      userId: userIp || "guest",
      userIp,
      isAuthenticated: false,
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded._id || userIp || "guest";

    return {
      userId,
      userIp,
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      userId: userIp || "guest",
      userIp,
      isAuthenticated: false,
    };
  }
}
