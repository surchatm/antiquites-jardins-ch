import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const recaptchaSecretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
}

const RECIPIENT_EMAIL = "eric.surchat@antiquites-jardins.ch";

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${recaptchaSecretKey}&response=${token}`,
    });

    const data = await response.json();
    console.log("reCAPTCHA verification response:", data);
    
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

async function sendEmail(to: string[], subject: string, html: string, replyTo?: string): Promise<any> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Antiquités et Jardins <onboarding@resend.dev>",
      to,
      subject,
      html,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, recaptchaToken }: ContactRequest = await req.json();

    console.log("Received contact form submission from:", email);

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Veuillez remplir tous les champs obligatoires" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({ error: "Veuillez compléter la vérification reCAPTCHA" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return new Response(
        JSON.stringify({ error: "La vérification reCAPTCHA a échoué. Veuillez réessayer." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("reCAPTCHA verified successfully");

    const emailSubject = subject || `Nouveau message de ${name}`;
    
    await sendEmail(
      [RECIPIENT_EMAIL],
      emailSubject,
      `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #5c4b3a; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
            Nouveau message depuis le site web
          </h2>
          
          <div style="background: #f9f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Nom:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${subject ? `<p style="margin: 0 0 10px 0;"><strong>Sujet:</strong> ${subject}</p>` : ''}
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e0d8; border-radius: 8px;">
            <h3 style="color: #5c4b3a; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">
            Ce message a été envoyé depuis le formulaire de contact du site Antiquités et Jardins.
          </p>
        </div>
      `,
      email
    );

    console.log("Email sent to shop owner");

    await sendEmail(
      [email],
      "Nous avons bien reçu votre message - Antiquités et Jardins",
      `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #5c4b3a; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
            Merci pour votre message, ${name}!
          </h2>
          
          <p style="line-height: 1.6;">
            Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
          </p>
          
          <div style="background: #f9f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #5c4b3a; margin-top: 0;">Récapitulatif de votre message:</h3>
            ${subject ? `<p><strong>Sujet:</strong> ${subject}</p>` : ''}
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="line-height: 1.6;">
            Cordialement,<br>
            <strong>Eric Surchat</strong><br>
            Antiquités et Jardins
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e0d8; margin: 20px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Rue de l'Ancien Comté 90, 1635 La Tour-de-Trême, Suisse<br>
            Tél: +41 79 458 78 20
          </p>
        </div>
      `
    );

    console.log("Confirmation email sent to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Message envoyé avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur est survenue" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
