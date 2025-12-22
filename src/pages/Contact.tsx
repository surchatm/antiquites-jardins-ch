import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const Contact = () => {
  return <>
      <Helmet>
        <title>Contact | Antiquités et Jardins - Eric Surchat</title>
        <meta name="description" content="Contactez Antiquités et Jardins à La Tour-de-Trême – Bulle, Suisse. Découvrez nos coordonnées, horaires et localisation pour visiter notre boutique d'antiquités." />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
                Nous Contacter
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                N'hésitez pas à nous rendre visite ou à nous contacter pour toute 
                question concernant nos pièces ou pour prendre rendez-vous.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info + Map */}
        <section className="pb-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-6 animate-fade-in-up">
                <Card className="border-border/50 shadow-card">
                  <CardContent className="p-8">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6">À propos de nous</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">Antiquités et Jardins est un magasin d'Antiquités fondé par Eric Surchat et situé à La Tour-de-Trême, au cœur de la Gruyère. Nous sélectionnons avec soin des pièces anciennes, meubles et objets décoratifs pour sublimer votre intérieur et votre jardin.</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Chaque objet raconte une histoire. Nous vous invitons à découvrir notre 
                      collection et à trouver la pièce unique qui enrichira votre espace de vie.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground mb-1">
                            Téléphone
                          </h3>
                          <a href="tel:+41261234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            +41 79 458 78 20
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground mb-1">
                            Email
                          </h3>
                          <a href="mailto:eric.surchat@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                            contact@antiquites-jardins.ch
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground mb-1">
                            Adresse
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Rue de l'Ancien Comté 90<br />
                            1635 La Tour-de-Trême<br />
                            Suisse
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground mb-1">
                            Horaires
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sur rendez-vous
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Google Maps */}
              <div className="animate-fade-in-up" style={{
              animationDelay: "200ms"
            }}>
              <Card className="border-border/50 shadow-card overflow-hidden h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2741.068066459808!2d7.068661!3d46.6056578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e89d8c8c5242d%3A0x7a66bcbd3c4323a1!2sAntiquit%C3%A9s%20et%20jardins!5e0!3m2!1sen!2sch!4v1766424440573!5m2!1sen!2sch"
                  className="w-full h-full min-h-[400px] border-0"
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
      </Layout>
    </>;
};
export default Contact;