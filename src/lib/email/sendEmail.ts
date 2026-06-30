const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log("Resend not configured. Would send email to", to, "subject:", subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Enzyme Skincare <orders@enzymeskincare.com>", to, subject, html }),
    });
    if (!res.ok) console.error("Resend error:", await res.text());
  } catch (e) {
    console.error("Email sending failed (non-blocking):", e);
  }
}