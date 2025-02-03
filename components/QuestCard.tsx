import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import React, { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const QuestCard = forwardRef<View, Props>(({ children, style }, ref) => {
  return (
    <View ref={ref} style={[styles.container, style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.lg,
  },
});
