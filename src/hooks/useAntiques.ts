import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Antique {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAntiqueInput {
  title: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface UpdateAntiqueInput {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
}

export const useAntiques = () => {
  return useQuery({
    queryKey: ["antiques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("antiques")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Antique[];
    },
  });
};

export const useCreateAntique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAntiqueInput) => {
      const { data, error } = await supabase
        .from("antiques")
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiques"] });
      toast.success("Article ajouté avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout: " + error.message);
    },
  });
};

export const useUpdateAntique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateAntiqueInput) => {
      const { data, error } = await supabase
        .from("antiques")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiques"] });
      toast.success("Article mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });
};

export const useDeleteAntique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("antiques")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiques"] });
      toast.success("Article supprimé");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });
};
