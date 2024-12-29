import { supabase } from "@lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch notifications for a specific user
export const useUserNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// update notification
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id }: { id: string }) {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications", id] });
    },
  });
};
