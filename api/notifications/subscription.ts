import { supabase } from "@lib/supabase";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@shared/types";

// subscribe to notifications
export const useNotificationSubscription = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const {
            new: newNotification,
            old: oldNotification,
            eventType,
          } = payload;
          queryClient.setQueryData(
            ["notifications", userId],
            (prev: Notification[]) => {
              switch (eventType) {
                case "INSERT":
                  return [newNotification, ...prev];
                case "UPDATE":
                  return prev.map((notification) =>
                    notification.id === newNotification.id
                      ? newNotification
                      : notification,
                  );
                case "DELETE":
                  return prev.filter(
                    (notification) => notification.id !== oldNotification.id,
                  );
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

// subscribe to insert notification
export const useInsertNotificationSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const notificationSubscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
      )
      .subscribe();

    return () => {
      notificationSubscription.unsubscribe();
    };
  }, []);
};

// subscribe to update notification
export const useUpdateNotificationSubscription = (id: number) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const notifications = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
      )
      .subscribe();

    return () => {
      notifications.unsubscribe();
    };
  }, []);
};
