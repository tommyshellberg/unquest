import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    width: "100%",
  },
  primaryPressed: {
    backgroundColor: Colors.secondary,
  },
  primaryText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  secondary: {
    backgroundColor: Colors.background.light,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.stone,
  },
  secondaryPressed: {
    backgroundColor: Colors.background.dark,
  },
  secondaryText: {
    color: Colors.text.dark,
    fontSize: FontSizes.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  // Add more button variants as needed
});
