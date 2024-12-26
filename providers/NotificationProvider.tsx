import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import { Notification } from "@shared/types";
import { useAuth } from "./AuthProvider";

type NotificationContextType = {
  notifications: Notification[];
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("You need to enable notifications in settings");
      }
    };

    requestPermissions();

    const fetchNotifications = async () => {
      if (profile?.id) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error.message);
        } else {
          setNotifications(data || []);
        }
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new;
          setNotifications((prev) => [...prev, newNotification] as any);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, notifications]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
