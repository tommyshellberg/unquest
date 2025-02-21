import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import { Colors } from "@/constants/theme";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
export default function Index() {
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);

  useEffect(() => {
    // Optionally, you could ask for permission here if needed.
    Notifications.requestPermissionsAsync();
  }, []);

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
