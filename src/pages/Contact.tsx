import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import boutiqueImage from "@/assets/boutique.webp";

const RECIPIENT_EMAIL = "eric.surchat@antiquites-jardins.ch";
const PHONE_NUMBER = "+41794587820";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaChecked) {
      toast.error("Veuillez confirmer que vous n'êtes pas un robot");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Votre message a bien été envoyé");

      setFormData({ name: "", email: "", subject: "", message: "" });
      setCaptchaChecked(false);
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je vous contacte depuis votre site web Antiquités et Jardins.");
    window.open(`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Contact | Antiquités et Jardins - Eric Surchat</title>
        <meta name="description" content="Contactez Antiquités et Jardins à La Tour-de-Trême – Bulle, Suisse. Découvrez nos coordonnées, horaires et localisation pour visiter notre boutique d'antiquités." />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="py-10 sm:py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
                Nous Contacter
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-2">
                N'hésitez pas à nous rendre visite ou à nous contacter pour toute 
                question concernant nos pièces ou pour prendre rendez-vous.
              </p>
              <div className="mt-6 sm:mt-8">
                <img 
                  src={boutiqueImage} 
                  alt="Boutique Antiquités et Jardins à La Tour-de-Trême" 
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-card"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info + Map */}
        <section className="pb-12 sm:pb-20">
          <div className="container px-4 sm:px-6">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                <Card className="border-border/50 shadow-card">
                  <CardContent className="p-5 sm:p-8">
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">À propos de nous</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">Antiquités et Jardins est un magasin d'Antiquités fondé par Eric Surchat et situé à La Tour-de-Trême, au cœur de la Gruyère. Nous sélectionnons avec soin des pièces anciennes, meubles et objets décoratifs pour sublimer votre intérieur et votre jardin.</p>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Chaque objet raconte une histoire. Nous vous invitons à découvrir notre 
                      collection et à trouver la pièce unique qui enrichira votre espace de vie.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  {/* Téléphone */}
                  <Card className="border-border/50 shadow-card hover:shadow-elegant transition-shadow duration-300 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1.5">
                            Téléphone
                          </h3>
                          <a href={`tel:${PHONE_NUMBER}`} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors block mb-2">
                            +41 79 458 78 20
                          </a>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={openWhatsApp}
                            className="h-8 text-xs gap-1.5 border-green-500/30 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-500/50"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="border-border/50 shadow-card hover:shadow-elegant transition-shadow duration-300 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1.5">
                            Email
                          </h3>
                          <a 
                            href={`mailto:${RECIPIENT_EMAIL}`} 
                            className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors block truncate"
                            title={RECIPIENT_EMAIL}
                          >
                            <span className="hidden sm:inline">{RECIPIENT_EMAIL}</span>
                            <span className="sm:hidden">eric.surchat@<br/>antiquites-jardins.ch</span>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Adresse */}
                  <Card className="border-border/50 shadow-card hover:shadow-elegant transition-shadow duration-300 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-burgundy/20 to-burgundy/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1.5">
                            Adresse
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Rue de l'Ancien Comté 90<br />
                            1635 La Tour-de-Trême<br />
                            Suisse
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Horaires */}
                  <Card className="border-border/50 shadow-card hover:shadow-elegant transition-shadow duration-300 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-bronze/20 to-bronze/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-bronze" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1.5">
                            Horaires
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Sur rendez-vous
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Google Maps */}
              <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <Card className="border-border/50 shadow-card overflow-hidden h-full min-h-[300px] sm:min-h-[400px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2741.068066459808!2d7.068661!3d46.6056578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e89d8c8c5242d%3A0x7a66bcbd3c4323a1!2sAntiquit%C3%A9s%20et%20jardins!5e0!3m2!1sen!2sch!4v1766424440573!5m2!1sen!2sch" 
                    className="w-full h-full min-h-[300px] sm:min-h-[400px] border-0" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    title="Antiquités et Jardins - Bulle, Suisse" 
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="pb-16 sm:pb-24">
          <div className="container px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-border/50 shadow-elegant animate-fade-in-up">
                <CardContent className="p-6 sm:p-10">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nom complet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Sujet
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Objet de votre message"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Votre message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    {/* Simple Captcha */}
                    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border border-border/50">
                      <Checkbox
                        id="captcha"
                        checked={captchaChecked}
                        onCheckedChange={(checked) => setCaptchaChecked(checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1 leading-none">
                        <Label
                          htmlFor="captcha"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Je ne suis pas un robot
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Cochez cette case pour confirmer que vous êtes un humain
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
