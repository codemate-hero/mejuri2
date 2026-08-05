const SYSTEM_USER_EMAIL = "system@mejuri.local";

export const SIGNIN_REQUESTED_EVENT = "mejuri-signin-requested";

export function hasAuthenticatedUserToken(token: string | null) {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalizedPayload = base64Payload.padEnd(
      base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
      "=",
    );
    const decoded: unknown = JSON.parse(window.atob(normalizedPayload));

    if (!decoded || typeof decoded !== "object") return false;

    const session = decoded as { email?: unknown; exp?: unknown };
    return (
      typeof session.email === "string" &&
      session.email !== SYSTEM_USER_EMAIL &&
      typeof session.exp === "number" &&
      session.exp * 1000 > Date.now()
    );
  } catch {
    return false;
  }
}

export function requestSignin() {
  window.dispatchEvent(new Event(SIGNIN_REQUESTED_EVENT));
}
