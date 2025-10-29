import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WteMonitoringData {
  id: string;
  site_id?: string;
  timestamp: string;
  primary_airflow?: number;
  secondary_airflow?: number;
  furnace_pressure?: number;
  oxygen_level?: number;
  co_level?: number;
  co2_level?: number;
  nox_level?: number;
  so2_level?: number;
  steam_flow?: number;
  steam_temperature?: number;
  steam_pressure?: number;
  power_output?: number;
  efficiency?: number;
  created_at: string;
}

export const useWteMonitoring = (siteId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: monitoringData, isLoading } = useQuery({
    queryKey: ["wteMonitoring", siteId],
    queryFn: async () => {
      let query = supabase
        .from("wte_monitoring_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (siteId) {
        query = query.eq("site_id", siteId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as WteMonitoringData[];
    },
  });

  const addMonitoringData = useMutation({
    mutationFn: async (newData: Omit<WteMonitoringData, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("wte_monitoring_data")
        .insert([newData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wteMonitoring"] });
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
    monitoringData,
    isLoading,
    addMonitoringData: addMonitoringData.mutate,
  };
};
