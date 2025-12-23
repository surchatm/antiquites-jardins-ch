import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("antique-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("antique-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast.error("Erreur lors du téléchargement: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
