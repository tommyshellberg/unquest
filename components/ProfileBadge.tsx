import { StyleSheet, Pressable, Image, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useCharacterStore } from "@/store/character-store";
import { CHARACTERS } from "@/constants/characters";

export function ProfileBadge() {
  const router = useRouter();
  const character = useCharacterStore((state) => state.character);

  if (!character) return null;

  const characterDetails = CHARACTERS.find((c) => c.id === character.type);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push("/profile")}
    >
      <View style={styles.stats}>
        <ThemedText style={styles.level}>
          Lvl {character.level} {characterDetails?.name}
        </ThemedText>
        <ThemedText style={styles.xp}>{character.currentXP} XP</ThemedText>
      </View>
      <View style={styles.imageContainer}>
        {characterDetails && (
          <Image
            source={characterDetails.profileImage}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.mist,
    marginLeft: Spacing.sm,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  stats: {
    alignItems: "flex-end",
  },
  level: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.forest,
  },
  xp: {
    fontSize: FontSizes.xs,
    color: Colors.forest,
    opacity: 0.8,
  },
});
