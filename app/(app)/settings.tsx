import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuestStore } from "@/store/quest-store";
import { usePOIStore } from "@/store/poi-store";
import { Colors } from "@/constants/Colors";
import { buttonStyles } from "@/styles/buttons";
import { layoutStyles } from "@/styles/layouts";
import { Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleReset = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Reset Zustand stores
      useQuestStore.getState().reset();
      usePOIStore.getState().reset();

      Alert.alert("App Data Reset", "The app data has been reset.");
    } catch (error) {
      console.error("Failed to reset app data:", error);
      Alert.alert("Error", "Failed to reset app data. Please try again.");
    }
  };

  const resetAppData = () => {
    Alert.alert(
      "Reset App Data",
      "Are you sure you want to reset the app data? This will delete all your progress.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: handleReset },
      ]
    );
  };

  return (
    <View style={layoutStyles.fullScreen}>
      <View
        style={{
          ...layoutStyles.contentContainer,
          justifyContent: "space-between",
        }}
      >
        <View>
          <ThemedText type="title">Settings Screen</ThemedText>
          <ThemedText type="body" style={{ ...Typography.body }}>
            Here you can manage your settings and reset your app data.
          </ThemedText>
        </View>
        <View style={styles.buttonSection}>
          <View style={styles.buttonGroup}>
            <ThemedText
              type="bodyBold"
              style={{ ...Typography.bodyBold, marginBottom: Spacing.md }}
            >
              Logout
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, marginBottom: Spacing.xl }}
            >
              Sign out of your account. You can log back in anytime.
            </ThemedText>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <ThemedText style={styles.buttonText} type="bodyBold">
                Logout
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.buttonGroup}>
            <ThemedText
              type="bodyBold"
              style={{ ...Typography.bodyBold, marginBottom: Spacing.md }}
            >
              Reset App Data
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, marginBottom: Spacing.xl }}
            >
              Your progress will be reset, your character will be deleted, and
              you will have to start over.
            </ThemedText>
            <Pressable onPress={resetAppData} style={styles.resetButton}>
              <ThemedText style={styles.buttonText} type="bodyBold">
                Reset App Data
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonSection: {
    gap: Spacing.xxl,
  },
  buttonGroup: {
    marginBottom: Spacing.xl,
  },
  resetButton: {
    ...buttonStyles.primary,
    padding: 16,
    backgroundColor: "#C4797A",
    width: "66%",
    alignSelf: "center",
  },
  logoutButton: {
    ...buttonStyles.primary,
    padding: 16,
    backgroundColor: "#FF4444",
    width: "66%",
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.light.text,
    textAlign: "center",
  },
});
