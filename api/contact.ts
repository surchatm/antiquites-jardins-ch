import { Resend } from "resend";

const verifyCaptcha = async (token: string) => {
  const res = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );
  const data = await res.json();
  return data.success;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, subject, message, company, captchaToken } = req.body;

    // Honeypot spam check
    if (company) return res.status(200).json({ success: true });

    // ReCAPTCHA verification
    if (!captchaToken || !(await verifyCaptcha(captchaToken))) {
      return res.status(400).json({ error: "ReCAPTCHA verification failed" });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await resend.emails.send({
      from: "Antiquités et Jardins <onboarding@resend.dev>",
      to: [process.env.CONTACT_RECIPIENT!],
      replyTo: email,
      subject: subject || `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message depuis le site</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
