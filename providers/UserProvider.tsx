import { useAuth } from "./AuthProvider";
import { createContext, useContext, PropsWithChildren } from "react";
import type { MedicationLog, Notification } from "@shared/types";
import { useUserMedicationLogs } from "@api/medication-logs";
import { useUserNotifications } from "@api/notifications/index";
import { useMedicationLogSubscription } from "@api/medication-logs/subscription";
import { useNotificationSubscription } from "@api/notifications/subscription";

type UserContextType = {
  medicationLogs: MedicationLog[];
  notifications: Notification[];
};

const UserContext = createContext<UserContextType>({
  medicationLogs: [],
  notifications: [],
});

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useAuth();
  const userId = profile?.id;

  const { data: medicationLogs = [] } = useUserMedicationLogs(userId);
  const { data: notifications = [] } = useUserNotifications(userId);
  useMedicationLogSubscription(userId);
  useNotificationSubscription(userId);

  return (
    <UserContext.Provider value={{ medicationLogs, notifications }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
