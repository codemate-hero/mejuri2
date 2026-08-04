import jwt from "jsonwebtoken";

function createAuthError(message = "your session is expired", status = 401) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function getUserIdFromRequest(req) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createAuthError("Authentication required", 401);
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw createAuthError("Authentication required", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.id || decoded._id;
  } catch (err) {
    throw createAuthError("your session is expired", 401);
  }
}
