import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import Colors from "@constants/Colors";
import { useClientOnlyValue } from "@components/useClientOnlyValue";
import { useAuth } from "@providers/AuthProvider";
import Bell from "@/components/Bell";
import HeaderTitle from "@/components/HeaderTitle";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { session } = useAuth();
  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: "home",
    },
    {
      name: "profile",
      title: "Profile",
      icon: "user",
    },
  ];

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerTitle: () => <HeaderTitle title={tab.title} />,
            tabBarLabel: tab.title,
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={tab.icon as "home" | "user"} color={color} />
            ),
            headerRight: () => <Bell />,
          }}
        />
      ))}
    </Tabs>
  );
}
