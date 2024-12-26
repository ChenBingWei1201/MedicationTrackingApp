import { supabase } from "@/lib/supabase";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { Profile, UserProfileUpdate, MedicationLog } from "@/shared/types";
import { Alert } from "react-native";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
  medicationLogs: MedicationLog[];
  updateTimestamps: (timestamps: string[]) => void;
  updateUserProfile: ({ fullName, avatarUrl }: UserProfileUpdate) => void;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  medicationLogs: [],
  updateTimestamps: () => {},
  updateUserProfile: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const updateTimestamps = async (timestamps: string[]) => {
    if (session) {
      const { error, data } = await supabase
        .from("profiles")
        .update({ timestamps })
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating timestamps:", error);
      } else {
        setProfile(data || null);
      }
    }
  };

  const updateUserProfile = async ({
    fullName,
    avatarUrl,
  }: UserProfileUpdate) => {
    if (session) {
      const { error, data } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) {
        Alert.alert("Error updating profile:", error.message);
      } else {
        setProfile(data || null);
      }
    }
  };

  const fetchProfileAndLogs = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setProfile(profileData || null);
      }

      const { data: logs, error: logsError } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", userId);

      if (logsError) {
        console.error("Error fetching medication logs:", logsError.message);
      } else {
        setMedicationLogs(logs || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        await fetchProfileAndLogs(session.user.id);
      }
      setLoading(false);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      // when click sign out -> redirect to sign in page instantly
      setSession(session); // update session to null
    });

    const medicationLogSubscription = supabase
      .channel("medication_logs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medication_logs" },
        (payload) => {
          console.log("Change received!", payload);
          const { new: newLog, old: oldLog, eventType } = payload;

          setMedicationLogs((prevLogs: MedicationLog[]) => {
            switch (eventType) {
              case "INSERT":
                return [...prevLogs, newLog];
              case "UPDATE":
                return prevLogs.map((log: any) =>
                  log.id === newLog.id ? newLog : log,
                );
              case "DELETE":
                return prevLogs.filter((log: any) => log.id !== oldLog.id);
              default:
                return prevLogs;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(medicationLogSubscription);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        isAdmin: (profile as any)?.group === "ADMIN",
        medicationLogs,
        updateTimestamps,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
