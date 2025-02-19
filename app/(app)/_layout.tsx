import React from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "@/components/ui/TabBarIcon";

import HomeScreen from "./home";
import MapScreen from "./map";
import SettingsScreen from "./settings";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function MainAppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { bottom: insets.bottom, height: 60 }],
          tabBarBackground: () => null,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/home-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/map-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/profile-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/settings-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    position: "absolute",
    left: 20,
    right: 20,
  },
});
