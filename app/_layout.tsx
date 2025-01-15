import { useState } from "react";
import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { ProfileInfo } from "@/components/ProfileInfo";
import { CustomDrawer } from "@/components/CustomDrawer";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <OnboardingGuard>
      <Stack
        screenOptions={{
          headerRight: () => <ProfileInfo />,
          headerLeft: () => (
            <Pressable
              onPress={() => setIsDrawerOpen(true)}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu-outline" size={24} color={Colors.forest} />
            </Pressable>
          ),
          headerTitle: "",
        }}
      />
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </OnboardingGuard>
  );
}
