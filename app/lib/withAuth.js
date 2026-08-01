import { getUserIdFromRequest } from "./auth";

export function withAuth(handler) {
  return async function (req, ...rest) {
    try {
      const userId = getUserIdFromRequest(req);
      return await handler(req, userId, ...rest);
    } catch (err) {
      return Response.json(
        { message: err.message || "your session is expired" },
        { status: err.status || 401 }
      );
    }
  };
}

export function requireAuth(req) {
  return getUserIdFromRequest(req);
}
