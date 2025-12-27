import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const data = await req.json();
    const { name, email, subject, message, company } = data;

    // Honeypot spam protection
    if (company) return new Response(JSON.stringify({ success: true }), { status: 200 });

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    await resend.emails.send({
      from: "Antiquités et Jardins <onboarding@resend.dev>",
      to: [process.env.CONTACT_RECIPIENT!],
      replyTo: email,
      subject: subject || `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message depuis le site antiquités-jardins.ch</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
