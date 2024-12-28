import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function QuestCard({ children, style }: Props) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.lg,
  },
});
