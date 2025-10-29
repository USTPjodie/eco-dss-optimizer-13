import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WasteData {
  id: string;
  municipality: string;
  waste_type: string;
  quantity: number;
  unit: string;
  collection_date: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useWasteData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wasteData, isLoading } = useQuery({
    queryKey: ["wasteData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waste_data")
        .select("*")
        .order("collection_date", { ascending: false });

      if (error) throw error;
      return data as WasteData[];
    },
  });

  const addWasteData = useMutation({
    mutationFn: async (newData: Omit<WasteData, "id" | "created_at" | "updated_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("waste_data")
        .insert([{ ...newData, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteData"] });
      toast({
        title: "Success",
        description: "Waste data added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWasteData = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WasteData> & { id: string }) => {
      const { data, error } = await supabase
        .from("waste_data")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteData"] });
      toast({
        title: "Success",
        description: "Waste data updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWasteData = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("waste_data")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteData"] });
      toast({
        title: "Success",
        description: "Waste data deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    wasteData,
    isLoading,
    addWasteData: addWasteData.mutate,
    updateWasteData: updateWasteData.mutate,
    deleteWasteData: deleteWasteData.mutate,
  };
};
