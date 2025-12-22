import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex flex-col items-start">
          <h1 className="font-display text-xl font-semibold text-foreground tracking-wide">
            Antiquités et Jardins
          </h1>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            par Eric Surchat
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
