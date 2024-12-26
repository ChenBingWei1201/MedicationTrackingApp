import { Text, View, FlatList, Pressable } from "react-native";
import { useNotifications } from "@providers/NotificationProvider";
import { supabase } from "@lib/supabase";

function NotificationScreen() {
  const { notifications } = useNotifications();

  const updateRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              if (!item.read) {
                await updateRead(item.id);
              }
            }}
          >
            <View
              className={`bg-white p-4 m-2 rounded-lg ${
                item.read ? "" : "shadow-md shadow-black"
              }`}
            >
              <Text className="text-xl font-bold">{item.message}</Text>
              <Text className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleString(undefined, {
                  hour12: false,
                })}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <Text className="text-2xl text-center text-gray-500">
            No Notifications Found
          </Text>
        )}
      />
    </View>
  );
}

export default NotificationScreen;
