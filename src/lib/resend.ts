type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured. Skipping email to", to);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Enzyme Skincare <noreply@enzymeskincare.com>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", await res.text());
  }
}

export async function sendConsultationConfirmation(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "Your Consultation Request — Enzyme Skincare",
    html: `<h1>Thank you, ${name}!</h1><p>We have received your consultation request and will reach out within 24 hours.</p>`,
  });
}

export async function sendContactAcknowledgement(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "We received your message — Enzyme Skincare",
    html: `<h1>Hi ${name},</h1><p>Thank you for reaching out! We have received your message and will get back to you within 24 hours.</p>`,
  });
}