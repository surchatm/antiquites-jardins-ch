import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Antique {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  position: number;
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
  position?: number;
}

export const useAntiques = () => {
  return useQuery({
    queryKey: ["antiques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("antiques")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Antique[];
    },
  });
};

export const useCreateAntique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAntiqueInput) => {
      // Get the max position to add new item at the end
      const { data: existingItems } = await supabase
        .from("antiques")
        .select("position")
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = existingItems?.[0]?.position ?? 0;

      const { data, error } = await supabase
        .from("antiques")
        .insert([{ ...input, position: maxPosition + 1 }])
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

export const useReorderAntiques = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      // Update all positions
      const updates = items.map(({ id, position }) =>
        supabase
          .from("antiques")
          .update({ position })
          .eq("id", id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw new Error("Erreur lors de la réorganisation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiques"] });
      toast.success("Ordre mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
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
