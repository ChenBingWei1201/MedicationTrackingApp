import { supabase } from "@lib/supabase";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MedicationLog } from "@/shared/types";

export const useMedicationLogSubscription = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("medication_logs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medication_logs",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const { new: newLog, old: oldLog, eventType } = payload;

          console.log(`Event Type: ${eventType}`, payload);

          queryClient.setQueryData(
            ["medicationLogs", userId],
            (prev: MedicationLog[]) => {
              switch (eventType) {
                case "INSERT":
                  return [...prev, newLog];
                case "UPDATE":
                  return prev.map((log) =>
                    log.id === newLog.id ? newLog : log,
                  );
                case "DELETE":
                  return prev.filter((log) => log.id !== oldLog.id);
                default:
                  return prev;
              }
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};
