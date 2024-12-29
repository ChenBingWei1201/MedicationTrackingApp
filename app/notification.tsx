import { Text, View, FlatList } from "react-native";
import { useUser } from "@providers/UserProvider";
import Notification from "@components/Notification";
import { useUpdateNotification } from "@api/notifications";

function NotificationScreen() {
  const { notifications } = useUser();
  const { mutate: updateNotification } = useUpdateNotification();

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Notification item={item} updateNotification={updateNotification} />
        )}
        ListEmptyComponent={() => (
          <Text className="text-2xl text-center text-gray-500">
            No Notifications
          </Text>
        )}
      />
    </View>
  );
}

export default NotificationScreen;
