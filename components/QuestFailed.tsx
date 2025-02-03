// components/QuestFailed.tsx
import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { Quest } from "@/store/types";

type Props = {
  quest: Quest;
  onAcknowledge: () => void;
};

export function QuestFailed({ quest, onAcknowledge }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Quest Failed</ThemedText>
      <ThemedText type="bodyBold">
        You unlocked your phone before the quest was completed.
      </ThemedText>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPressOut={onAcknowledge}
      >
        <ThemedText type="bodyBold">OK</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.stone,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
  },
  buttonPressed: {
    backgroundColor: Colors.secondary,
  },
});
