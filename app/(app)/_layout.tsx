import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
import { Colors } from "@/constants/theme";

const Tab = createBottomTabNavigator();

export default function MainAppLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Activate lock detection for the whole main app.
  useLockStateDetection();

  // Determine quest state
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const pendingQuest = useQuestStore((state) => state.pendingQuest);
  const failedQuest = useQuestStore((state) => state.failedQuest);
  const recentCompletedQuest = useQuestStore(
    (state) => state.recentCompletedQuest
  );
  const resetFailedQuest = useQuestStore((state) => state.resetFailedQuest);

  // Handle navigation based on quest state
  useEffect(() => {
    // Don't redirect if we're already on the right screen
    if (
      pathname.includes("/failed-quest") ||
      pathname.includes("/active-quest") ||
      pathname.includes("/quest-complete")
    ) {
      return;
    }

    // Only redirect if we're on the home screen or a tab screen
    const isTabScreen = ["/home", "/map", "/profile", "/settings"].some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    if (!isTabScreen) {
      return;
    }

    if (failedQuest) {
      router.replace("/failed-quest");
    } else if (activeQuest || pendingQuest) {
      router.replace("/active-quest");
    } else if (recentCompletedQuest) {
      router.replace("/quest-complete");
    }
  }, [activeQuest, pendingQuest, failedQuest, recentCompletedQuest, pathname]);

  // If there's a failed quest, or an active/pending quest, return the dedicated screen
  if (failedQuest) {
    return (
      <FailedQuestScreen
        onAcknowledge={() => {
          resetFailedQuest();
          router.replace("/home");
        }}
      />
    );
  } else if (activeQuest || pendingQuest) {
    // Check for either active or pending quest
    return <ActiveQuestScreen />;
  } else if (recentCompletedQuest) {
    if (pathname !== "/quest-complete") {
      return <QuestCompleteScreen />;
    }
  }

  // Render the tab navigator for all routes
  return (
    <View style={layoutStyles.fullScreen}>
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 80 + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ],
          // Use a gradient background for the tab bar
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                overflow: "hidden",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <LinearGradient
                colors={[
                  Colors.background.light || "#f5f0e6", // Light sand color
                  Colors.background.dark || "#e6dfd0", // Slightly darker sand
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[
                  styles.tabBarBackground,
                  { paddingBottom: insets.bottom },
                ]}
              />
            </View>
          ),
        }}
        // This ensures content doesn't render behind the tab bar
      >
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/home-icon.jpg")}
                focused={focused}
                label="Home"
              />
            ),
          }}
        />
        <Tab.Screen
          name="map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/map-icon.jpg")}
                focused={focused}
                label="Map"
              />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/profile-icon.jpg")}
                focused={focused}
                label="Profile"
              />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/ui/settings-icon.jpg")}
                focused={focused}
                label="Settings"
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
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarBackground: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
