/**
 * Determine the base URL for the current environment.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL env var (if set and non-empty)
 * 2. Host header from the incoming request (dynamic, works everywhere)
 * 3. Hardcoded fallback (only as last resort)
 */
export function getBaseUrl(req?: { headers?: { get: (name: string) => string | null } }): string {
  // Priority 1: environment variable
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // Priority 2: request host header (works in any deployment)
  if (req?.headers) {
    const host = req.headers.get("host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      return `${protocol}://${host}`;
    }
  }

  // Priority 3: fallback — same as other files in the project use
  return "https://enzymeskincare.com";
}
