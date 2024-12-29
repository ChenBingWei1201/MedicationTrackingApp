import { supabase } from "@lib/supabase";
import type {
  UserProfileUpdate,
  Profile,
  UserTimestampsUpdate,
} from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch user profile
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as Profile;
    },
  });
};

// Update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, fullName, avatarUrl }: UserProfileUpdate) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Profile;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["profiles", id] });
    },
  });
};

// Update user timestamps
export const useUpdateUserTimestamps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, timestamps }: UserTimestampsUpdate) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ timestamps })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Profile;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      await queryClient.invalidateQueries({ queryKey: ["profiles", id] });
    },
  });
};
