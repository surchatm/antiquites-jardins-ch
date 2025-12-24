import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Upload, Link as LinkIcon, Loader2, X, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onGoogleDriveClick: () => void;
  googleDriveLoading?: boolean;
}

const ImageUploader = ({ value, onChange, onGoogleDriveClick, googleDriveLoading }: ImageUploaderProps) => {
  const { uploadImage, uploading } = useImageUpload();
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPG, PNG, WebP ou GIF.");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image est trop grande (max 10 Mo).");
      return;
    }

    const url = await uploadImage(file);
    if (url) {
      onChange(url);
      toast.success("Image téléchargée avec succès");
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>Image</Label>
      
      {value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border">
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!value && (
        <Tabs defaultValue="drive" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="drive">
              <FolderOpen className="w-4 h-4 mr-1" />
              Drive
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-1" />
              Fichier
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="w-4 h-4 mr-1" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-3">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                )}
                <span className="text-sm text-muted-foreground text-center">
                  {uploading ? "Téléchargement..." : "Cliquez ou glissez une image"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WebP, GIF (max 10 Mo)
                </span>
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="drive" className="mt-3">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
              <FolderOpen className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-3">
                Sélectionnez une image depuis Google Drive
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={onGoogleDriveClick}
                disabled={googleDriveLoading}
              >
                {googleDriveLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FolderOpen className="w-4 h-4 mr-2" />
                )}
                Ouvrir Google Drive
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-3">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
              >
                Ajouter
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ImageUploader;
