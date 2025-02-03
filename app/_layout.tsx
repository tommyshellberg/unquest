import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { ProfileInfo } from "@/components/ProfileInfo";
import { CustomDrawer } from "@/components/CustomDrawer";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <OnboardingGuard>
          <Stack
            screenOptions={{
              headerRight: () => <ProfileInfo />,
              headerLeft: () => (
                <TouchableOpacity
                  onPressOut={() => {
                    setIsDrawerOpen(true);
                  }}
                  hitSlop={20}
                  style={styles.menuButton}
                >
                  <Ionicons
                    name="menu-outline"
                    size={24}
                    color={Colors.forest}
                  />
                </TouchableOpacity>
              ),
              headerTitle: "",
            }}
          />
          <CustomDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </OnboardingGuard>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 16,
  },
});
