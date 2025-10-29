import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WteSite {
  id: string;
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  technology: string;
  status: string;
  environmental_score?: number;
  economic_score?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useWteSites = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sites, isLoading } = useQuery({
    queryKey: ["wteSites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wte_sites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WteSite[];
    },
  });

  const addSite = useMutation({
    mutationFn: async (newSite: Omit<WteSite, "id" | "created_at" | "updated_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("wte_sites")
        .insert([{ ...newSite, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wteSites"] });
      toast({
        title: "Success",
        description: "Site added successfully.",
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

  const updateSite = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WteSite> & { id: string }) => {
      const { data, error } = await supabase
        .from("wte_sites")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wteSites"] });
      toast({
        title: "Success",
        description: "Site updated successfully.",
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

  const deleteSite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("wte_sites")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wteSites"] });
      toast({
        title: "Success",
        description: "Site deleted successfully.",
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
    sites,
    isLoading,
    addSite: addSite.mutate,
    updateSite: updateSite.mutate,
    deleteSite: deleteSite.mutate,
  };
};
