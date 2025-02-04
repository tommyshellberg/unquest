import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/theme";
import TabBarIcon from "@/components/ui/TabBarIcon";

// Import your screens
import QuestsScreen from "./quests";
import MapScreen from "./map";
import HomeScreen from "./home";
import CharacterScreen from "./profile";
import SettingsScreen from "./settings";

const Tab = createBottomTabNavigator();
export const TAB_BAR_HEIGHT = 100;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="Quests"
          component={QuestsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/quests-icon.jpg")}
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
                source={require("@/assets/images/map-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/home-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Character"
          component={CharacterScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                source={require("@/assets/images/profile-icon.jpg")}
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
                source={require("@/assets/images/settings-icon.jpg")}
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
    position: "absolute",
    borderTopWidth: 0,
    elevation: 0,
    height: TAB_BAR_HEIGHT,
    bottom: 10,
    left: 20,
    right: 20,
  },
});
