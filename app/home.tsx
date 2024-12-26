import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ActiveQuest } from "@/components/ActiveQuest";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ActiveQuest />
      {/* Other home screen content */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
