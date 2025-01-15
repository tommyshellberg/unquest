import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors, Spacing, FontSizes } from "@/constants/theme";
import { useCharacterStore } from "@/store/character-store";
import { CHARACTERS } from "@/constants/characters";

type Props = {
  size?: "small" | "large";
};

export function ProfileInfo({ size = "small" }: Props) {
  const character = useCharacterStore((state) => state.character);
  if (!character) return null;

  const characterDetails = CHARACTERS.find((c) => c.id === character.type);
  const imageSize = size === "small" ? 64 : 128;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          { width: imageSize, height: imageSize, borderRadius: imageSize / 2 },
        ]}
      >
        {characterDetails && (
          <Image
            source={characterDetails.profileImage}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      <ThemedText style={styles.name}>{character.name}</ThemedText>
      <ThemedText style={styles.level}>
        Level {character.level} {characterDetails?.name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: Spacing.md,
  },
  imageContainer: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.mist,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.forest,
    marginTop: Spacing.sm,
  },
  level: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    marginTop: Spacing.xs,
  },
});
