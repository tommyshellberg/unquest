import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuestStore } from "@/store/quest-store";
import { usePOIStore } from "@/store/poi-store";
import { Colors } from "@/constants/Colors";
import { buttonStyles } from "@/styles/buttons";
import { layoutStyles } from "@/styles/layouts";
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

const handleReset = async () => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.clear();

    // Reset Zustand stores
    useQuestStore.getState().reset();
    usePOIStore.getState().reset();

    // Reset any other stores here

    Alert.alert("App Data Reset", "The app data has been reset.");
  } catch (error) {
    console.error("Failed to reset app data:", error);
    Alert.alert("Error", "Failed to reset app data. Please try again.");
  }
};

export default function SettingsScreen() {
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
          <ThemedText type="body">
            Here you can manage your settings and reset your app data.
          </ThemedText>
        </View>
        <View>
          <ThemedText type="subtitle">Reset App Data</ThemedText>
          <ThemedText type="bodyBold">
            Your progress will be reset, your character will be deleted, and you
            will have to start over.
          </ThemedText>
          <Pressable onPress={resetAppData} style={styles.resetButton}>
            <ThemedText style={styles.resetButtonText} type="bodyBold">
              Reset App Data
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resetButton: {
    ...buttonStyles.primary,
    padding: 16,
    backgroundColor: "red",
    width: "66%",
    alignSelf: "center",
  },
  resetButtonText: {
    color: Colors.light.text,
    textAlign: "center",
  },
});
