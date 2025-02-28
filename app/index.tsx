import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import { Colors } from "@/constants/theme";

// Extract the component logic for better testability
export function IndexContent({
  character,
  account,
}: {
  character: any | undefined;
  account: any | undefined;
}) {
  if (character === undefined || account === undefined) {
    return (
      <View style={styles.container} testID="loading-indicator">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return null;
}

// Main component that connects to the store
export default function Index() {
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);

  return <IndexContent character={character} account={account} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.dark,
  },
});
