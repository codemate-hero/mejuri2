export async function GET() {
  if (!process.env.PAYPAL_CLIENT_ID) {
    return Response.json({ message: "PayPal is not configured" }, { status: 503 });
  }

  return Response.json({
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: "USD",
  });
}
