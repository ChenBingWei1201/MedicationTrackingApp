import { Text, View, Pressable } from "react-native";
import type { Notification as NotificationType } from "@shared/types";
import { UseMutateFunction } from "@tanstack/react-query";

type NotificationProps = {
  item: NotificationType;
  updateNotification: UseMutateFunction<
    void,
    Error,
    {
      id: string;
    },
    unknown
  >;
};

function Notification({ item, updateNotification }: NotificationProps) {
  return (
    <Pressable
      onPress={() => {
        if (!item.read) {
          updateNotification({ id: item.id });
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
  );
}

export default Notification;
