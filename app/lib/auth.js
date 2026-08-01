import jwt from "jsonwebtoken";

export function getUserIdFromRequest(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.id;
  } catch (err) {
    const error = new Error("your session is expired");
    error.status = 401;
    throw error;
  }
}
