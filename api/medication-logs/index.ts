import { MedicationLog } from "@shared/types";
import { supabase } from "@lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch notifications for a specific user
export const useUserMedicationLogs = (userId: string) => {
  return useQuery({
    queryKey: ["medicationLogs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data as MedicationLog[];
    },
  });
};
