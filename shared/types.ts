
import type { Session } from "@supabase/supabase-js";

export type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
  setProfile: (profile: Profile) => void;
};

export type Profile = {
  id: string;
  group: string;
  full_name: string;
  avatar_url: string;
  timestamps: string[];
};

export type UserProfileUpdate = {
  id: string;
  fullName: string;
  avatarUrl: string;
};

export type UserTimestampsUpdate = {
  id: string;
  timestamps: string[];
};

export type Notification = {
  id: string;
  created_at: string;
  user_id: string;
  message: string;
  read: boolean;
};

export type MedicationLog = {
  id: string;
  created_at: string;
  user_id: string;
  time: string;
  taken: boolean;
  date: string;
};

export type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};
