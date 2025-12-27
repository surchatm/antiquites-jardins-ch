import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
  useAntiques,
  useCreateAntique,
  useUpdateAntique,
  useDeleteAntique,
  useReorderAntiques,
  Antique,
} from "@/hooks/useAntiques";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, LogOut, Loader2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ImageUploader from "@/components/admin/ImageUploader";
import SortableAntiqueCard from "@/components/admin/SortableAntiqueCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

const antiqueSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre est trop long"),
  description: z.string().max(1000, "La description est trop longue").optional(),
  price: z.number().min(0, "Le prix doit être positif"),
  image_url: z.string().url("URL d'image invalide").optional().or(z.literal("")),
});

// Cloudinary configuration
declare global {
  interface Window {
    cloudinary: any;
  }
}

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: antiques, isLoading: antiquesLoading } = useAntiques();
  const createAntique = useCreateAntique();
  const updateAntique = useUpdateAntique();
  const deleteAntique = useDeleteAntique();
  const reorderAntiques = useReorderAntiques();

  const [localAntiques, setLocalAntiques] = useState<Antique[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAntique, setEditingAntique] = useState<Antique | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = useState<{ cloudName: string; apiKey: string } | null>(null);

  // Fetch Cloudinary configuration from edge function
  useEffect(() => {
    const fetchCloudinaryConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('cloudinary-config');
        if (error) throw error;
        if (data?.cloudName && data?.apiKey) {
          setCloudinaryConfig(data);
        }
      } catch (error) {
        console.error('Failed to fetch Cloudinary config:', error);
      }
    };
    fetchCloudinaryConfig();
  }, []);

  // Sync local state with server data
  useEffect(() => {
    if (antiques) {
      setLocalAntiques(antiques);
    }
  }, [antiques]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalAntiques((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update positions in database
        const updates = newItems.map((item, index) => ({
          id: item.id,
          position: index + 1,
        }));
        reorderAntiques.mutate(updates);

        return newItems;
      });
    }
  };

  // Load Cloudinary Media Library widget script
  useEffect(() => {
    if (window.cloudinary) {
      setCloudinaryLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://media-library.cloudinary.com/global/all.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setCloudinaryLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCloudinaryClick = () => {
    if (!cloudinaryConfig?.cloudName || !cloudinaryConfig?.apiKey) {
      toast.error("Configuration Cloudinary manquante. Contactez l'administrateur.");
      return;
    }

    if (!cloudinaryLoaded || !window.cloudinary) {
      toast.error("Chargement de Cloudinary en cours...");
      return;
    }

    setCloudinaryLoading(true);

    try {
      const mediaLibrary = window.cloudinary.createMediaLibrary(
        {
          cloud_name: cloudinaryConfig.cloudName,
          api_key: cloudinaryConfig.apiKey,
          folder: { path: "antiquites-jardins", resource_type: "image" },
          multiple: false,
          max_files: 1,
          insert_caption: "Sélectionner",
          default_transformations: [[]]
        },
        {
          insertHandler: (data: any) => {
            if (data.assets && data.assets.length > 0) {
              const asset = data.assets[0];
              // Use the secure CDN URL
              const imageUrl = asset.secure_url || asset.url;
              setFormData((prev) => ({ ...prev, image_url: imageUrl }));
              toast.success("Image sélectionnée depuis Cloudinary");
            }
            setCloudinaryLoading(false);
          },
        }
      );

      mediaLibrary.show();

      // Handle close without selection
      const checkClosed = setInterval(() => {
        const widget = document.querySelector('.cloudinary-widget');
        if (!widget) {
          clearInterval(checkClosed);
          setCloudinaryLoading(false);
        }
      }, 500);

      // Cleanup after 60 seconds max
      setTimeout(() => {
        clearInterval(checkClosed);
        setCloudinaryLoading(false);
      }, 60000);

    } catch (error: any) {
      setCloudinaryLoading(false);
      toast.error("Erreur Cloudinary: " + error.message);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", image_url: "" });
    setFormErrors({});
    setEditingAntique(null);
  };

  const openEditDialog = (antique: Antique) => {
    setEditingAntique(antique);
    setFormData({
      title: antique.title,
      description: antique.description || "",
      price: String(antique.price),
      image_url: antique.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsedData = {
      title: formData.title,
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      image_url: formData.image_url || undefined,
    };

    const result = antiqueSchema.safeParse(parsedData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errors[String(err.path[0])] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      if (editingAntique) {
        await updateAntique.mutateAsync({
          id: editingAntique.id,
          ...parsedData,
        });
      } else {
        await createAntique.mutateAsync(parsedData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAntique.mutateAsync(id);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50 shadow-elegant text-center">
          <CardContent className="pt-8 pb-6">
            <h1 className="font-display text-xl font-semibold text-foreground mb-3">
              Accès non autorisé
            </h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas les droits d'administration.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
              <Button variant="elegant" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Administration | Antiquités et Jardins</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
          <div className="container px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-base sm:text-lg font-semibold text-foreground truncate">
                Administration
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voir le site
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden" asChild>
                <Link to="/">
                  <Home className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
              <Button variant="outline" size="icon" onClick={handleSignOut} className="sm:hidden">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                Gestion des articles
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Glissez-déposez pour réorganiser les articles
              </p>
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                // Prevent closing while Cloudinary picker is open
                if (!open && cloudinaryLoading) return;
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
              modal={!cloudinaryLoading}
            >
              <DialogTrigger asChild>
                <Button variant="elegant" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un article
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="sm:max-w-lg" 
                onPointerDownOutside={(e) => {
                  // Prevent closing when clicking outside while picker is active
                  if (cloudinaryLoading) e.preventDefault();
                }}
                onOpenAutoFocus={(e) => {
                  // Prevent focus trap from interfering with Cloudinary picker
                  if (cloudinaryLoading) e.preventDefault();
                }}
                onInteractOutside={(e) => {
                  // Allow interaction with Cloudinary picker iframe
                  if (cloudinaryLoading) e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle className="font-display">
                    {editingAntique ? "Modifier l'article" : "Nouvel article"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ex: Armoire Louis XV"
                    />
                    {formErrors.title && (
                      <p className="text-xs text-destructive">{formErrors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Décrivez l'article..."
                      rows={3}
                    />
                    {formErrors.description && (
                      <p className="text-xs text-destructive">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (CHF) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                    />
                    {formErrors.price && (
                      <p className="text-xs text-destructive">{formErrors.price}</p>
                    )}
                  </div>

                  <ImageUploader
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    onCloudinaryClick={handleCloudinaryClick}
                    cloudinaryLoading={cloudinaryLoading}
                  />
                  {formErrors.image_url && (
                    <p className="text-xs text-destructive">
                      {formErrors.image_url}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="elegant"
                      disabled={createAntique.isPending || updateAntique.isPending}
                    >
                      {(createAntique.isPending || updateAntique.isPending) && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {editingAntique ? "Enregistrer" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Articles Grid */}
          {antiquesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-4">
                    <Skeleton className="aspect-[4/3] w-full mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : localAntiques && localAntiques.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localAntiques.map((a) => a.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {localAntiques.map((antique) => (
                    <SortableAntiqueCard
                      key={antique.id}
                      antique={antique}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <Card className="border-border/50 shadow-card">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Aucun article
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter votre premier article en vente.
                </p>
                <Button variant="elegant" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un article
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default Admin;
