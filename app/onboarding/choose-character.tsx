import { Image, StyleSheet, Pressable, View, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { CHARACTERS } from "../../constants/characters";
import { useRouter } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { CharacterType } from "@/store/types";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ChooseCharacterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );

  const handleContinue = () => {
    if (!selectedCharacter) return;

    // Get character details from CHARACTERS constant
    const character = CHARACTERS.find((c) => c.id === selectedCharacter);
    if (!character) return;

    // Create character in store
    createCharacter(
      character.id as CharacterType, // Make sure CHARACTERS ids match CharacterType
      character.name
    );

    router.push("/onboarding/screen-time-goal");
  };

  // Hide header and drawer for onboarding flow
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false, // Disable swipe gesture for drawer
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/onboarding-bg-2.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
          <ThemedText type="title">Choose your Character</ThemedText>
          <ThemedText type="subtitle">
            Choose the character you feel best represents the best version of
            yourself. Each embodies different virtues that grow stronger as you
            spend time away.
          </ThemedText>
        </ThemedView>

        <View style={[styles.grid, { backgroundColor: "transparent" }]}>
          {CHARACTERS.map((character) => (
            <Pressable
              key={character.id}
              style={[
                styles.characterCard,
                selectedCharacter === character.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedCharacter(character.id)}
            >
              <Image
                source={character.image}
                style={styles.characterImage}
                resizeMode="cover"
              />
              {selectedCharacter === character.id && (
                <View style={styles.characterOverlay}>
                  <ThemedText style={styles.characterOverlayTitle}>
                    {character.title}
                  </ThemedText>
                  <ThemedText style={styles.characterDescription}>
                    {character.description}
                  </ThemedText>
                </View>
              )}
              <ThemedView
                style={[
                  styles.characterInfo,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText style={styles.characterName}>
                  {character.name}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </View>

        <ThemedView style={[styles.footer, { backgroundColor: "transparent" }]}>
          <Pressable
            style={[
              styles.continueButton,
              !selectedCharacter && styles.continueButtonDisabled,
            ]}
            disabled={!selectedCharacter}
            onPress={handleContinue}
          >
            <ThemedText type="bodyBold">Continue</ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  characterCard: {
    width: "45%",
    aspectRatio: 2 / 3.5,
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedCard: {
    borderColor: Colors.cream,
    transform: [{ scale: 1.02 }],
  },
  characterImage: {
    width: "100%",
    height: "85%",
  },
  characterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "15%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  characterOverlayTitle: {
    color: Colors.cream,
    fontSize: FontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  characterDescription: {
    color: Colors.cream,
    textAlign: "center",
    fontSize: FontSizes.sm,
    lineHeight: 20,
    opacity: 0.9,
  },
  characterInfo: {
    padding: Spacing.sm,
    height: "15%",
    justifyContent: "center",
  },
  characterName: {
    textAlign: "center",
    fontSize: FontSizes.md,
    color: Colors.cream,
    fontWeight: "600",
  },
  footer: {
    paddingTop: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: Colors.button.disabled,
    opacity: 0.5,
  },
  continueButtonTextDisabled: {
    opacity: 0.5,
  },
});
