import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs, Link } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { Image } from "react-native";
import Colors from "@constants/Colors";
import { useColorScheme } from "@components/useColorScheme";
import { useClientOnlyValue } from "@components/useClientOnlyValue";
import { useAuth } from "@providers/AuthProvider";
import { useNotifications } from "@providers/NotificationProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuth();
  const { notifications } = useNotifications();

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read,
  );

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View className="flex flex-row items-center gap-2">
              <Image
                src="https://i.postimg.cc/VdJXW8h1/logo.png"
                className="w-14 h-14 rounded-full"
              />
              <Text className="text-black text-3xl font-semibold">Home</Text>
            </View>
          ),
          tabBarLabel: "Home",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/notification" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="bell"
                    size={24}
                    color={hasUnreadNotifications ? "#2f95dc" : "gray"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: () => (
            <View className="flex flex-row items-center gap-2">
              <Image
                src="https://i.postimg.cc/VdJXW8h1/logo.png"
                className="w-14 h-14 rounded-full"
              />
              <Text className="text-black text-3xl font-semibold">Profile</Text>
            </View>
          ),
          tabBarLabel: "Profile",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => (
            <Link href="/notification" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="bell"
                    size={24}
                    color={hasUnreadNotifications ? "#2f95dc" : "gray"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
