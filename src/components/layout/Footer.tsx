import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">
              Antiquités et Jardins
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Pièces uniques et objets anciens sélectionnés avec passion par Eric Surchat à La Tour-de-Trême, Suisse.</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>La Tour-de-Trême – Bulle, Suisse</p>
              <a href="mailto:eric.surchat@gmail.com" className="hover:text-primary transition-colors">
                eric.surchat@antiquites-jardins.ch
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Antiquités et Jardins. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;