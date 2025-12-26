import { Card, CardContent } from "@/components/ui/card";

interface AntiqueCardProps {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

const AntiqueCard = ({ title, description, price, imageUrl }: AntiqueCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-elegant transition-all duration-500">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <span className="font-display text-4xl text-muted-foreground/30">A&J</span>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}
        <p className="font-display text-xl font-semibold text-primary">
          {formatPrice(price)}
        </p>
      </CardContent>
    </Card>
  );
};

export default AntiqueCard;
