import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Antique } from "@/hooks/useAntiques";

interface SortableAntiqueCardProps {
  antique: Antique;
  onEdit: (antique: Antique) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number) => string;
}

const SortableAntiqueCard = ({
  antique,
  onEdit,
  onDelete,
  formatPrice,
}: SortableAntiqueCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: antique.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-border/50 shadow-card ${isDragging ? "shadow-lg" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground transition-colors touch-none"
            aria-label="Réorganiser"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <div className="flex-1 aspect-[4/3] rounded-md overflow-hidden bg-muted">
            {antique.image_url ? (
              <img
                src={antique.image_url}
                alt={antique.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary">
                <span className="font-display text-2xl text-muted-foreground/30">
                  A&J
                </span>
              </div>
            )}
          </div>
        </div>
        <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1">
          {antique.title}
        </h3>
        {antique.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {antique.description}
          </p>
        )}
        <p className="font-display text-lg font-semibold text-primary mb-4">
          {formatPrice(Number(antique.price))}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(antique)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">
                  Supprimer cet article ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L'article "{antique.title}"
                  sera définitivement supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(antique.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SortableAntiqueCard;
