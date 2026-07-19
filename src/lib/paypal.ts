/**
 * Shared PayPal helper: OAuth token management.
 * Caches token until expires_in to avoid repeated API calls.
 */

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function getBaseUrl(): string {
  const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
  return env === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function getClientId(): string {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
}

function getSecret(): string {
  return process.env.PAYPAL_CLIENT_SECRET || "";
}

export function isPayPalConfigured(): boolean {
  return !!(getClientId() && getSecret());
}

export async function getPayPalAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.accessToken;
  }

  const clientId = getClientId();
  const secret = getSecret();
  const baseUrl = getBaseUrl();
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errText = await res.text();
    // Log without exposing credentials
    console.error("PayPal auth failed (status:", res.status, ")");
    throw new Error("PayPal auth failed");
  }

  const data = await res.json();
  const expiresIn = data.expires_in || 32400; // default 9h
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return data.access_token;
}

export async function verifyWebhookSignature(
  rawBody: string,
  headers: Headers
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID not configured, skipping verification");
    return false;
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const baseUrl = getBaseUrl();
    const transmissionId = headers.get("paypal-transmission-id") || "";
    const transmissionTime = headers.get("paypal-transmission-time") || "";
    const certUrl = headers.get("paypal-cert-url") || "";
    const authAlgo = headers.get("paypal-auth-algo") || "";
    const transmissionSig = headers.get("paypal-transmission-sig") || "";

    const verificationReq = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    };

    const res = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationReq),
    });

    const result = await res.json();
    return result.verification_status === "SUCCESS";
  } catch (err) {
    console.error("Webhook verification error");
    return false;
  }
}

export async function getOrderDetails(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to get order details");
  return res.json();
}
