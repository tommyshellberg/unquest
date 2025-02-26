import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Image, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarIcon from "@/components/ui/TabBarIcon";
import HomeScreen from "./home";
import MapScreen from "./map";
import ProfileScreen from "./profile";
import SettingsScreen from "./settings";
import useLockStateDetection from "@/hooks/useLockStateDetection";
import { useQuestStore } from "@/store/quest-store";
import FailedQuestScreen from "./failed-quest";
import ActiveQuestScreen from "./active-quest";
import { layoutStyles } from "@/styles/layouts";
import { router, usePathname } from "expo-router";
import QuestCompleteScreen from "./quest-complete";

const Tab = createBottomTabNavigator();

export default function MainAppLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Activate lock detection for the whole main app.
  useLockStateDetection();

  // Determine quest state.
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const failedQuest = useQuestStore((state) => state.failedQuest);
  const recentCompletedQuest = useQuestStore(
    (state) => state.recentCompletedQuest
  );
  const resetFailedQuest = useQuestStore((state) => state.resetFailedQuest);

  // Handle navigation to quest-complete in an effect
  useEffect(() => {
    if (recentCompletedQuest) {
      console.log(
        "recentCompletedQuest detected, navigating to quest-complete"
      );
    }
  }, [recentCompletedQuest, pathname]);

  // If there's a failed quest, or an active quest, return the dedicated screen.
  if (failedQuest)
    return (
      <FailedQuestScreen
        onAcknowledge={() => {
          resetFailedQuest();
          router.replace("/home");
        }}
      />
    );
  else if (activeQuest) {
    return <ActiveQuestScreen />;
  } else if (recentCompletedQuest) {
    if (pathname !== "/quest-complete") {
      return <QuestCompleteScreen />;
    }
  }

  // Otherwise, render the normal Tab Navigator.
  return (
    <View style={layoutStyles.fullScreen}>
      {/* Main content container with safe area margins */}
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
    </View>
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
