import { Link } from "expo-router";
import { Pressable, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useUser } from "@providers/UserProvider";

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View className="absolute right-2.5 -top-1.5 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
      <Text className="text-white text-sm">{count}</Text>
    </View>
  );
}

function Bell() {
  const { notifications } = useUser();
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read,
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <Link href="/notification" asChild>
      <Pressable>
        {({ pressed }) => (
          <View>
            <FontAwesome
              name="bell"
              size={24}
              color={hasUnreadNotifications ? "#2f95dc" : "gray"}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
            <NotificationBadge count={unreadCount} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export default Bell;
