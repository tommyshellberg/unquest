import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import { Colors } from "@/constants/theme";

export default function Index() {
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);

  if (character === undefined || account === undefined) {
    console.log("character or account is undefined");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.dark,
  },
});
