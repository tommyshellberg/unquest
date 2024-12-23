import { Image, StyleSheet, Pressable, View, ScrollView } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { CHARACTERS, Character } from "../../constants/characters";

export default function ChooseCharacterScreen() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/unquest-onboarding-bg-2.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView
        style={[styles.overlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <ThemedView
            style={[styles.header, { backgroundColor: "transparent" }]}
          >
            <ThemedText type="title" style={styles.title}>
              Choose your Character
            </ThemedText>
            <ThemedText style={styles.description}>
              Select the hero who will grow stronger with every minute you spend
              offline. Each character has unique traits and abilities that
              develop differently.
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
                <ThemedView
                  style={[
                    styles.characterInfo,
                    { backgroundColor: "transparent" },
                  ]}
                >
                  <ThemedText style={styles.characterName}>
                    {character.name}
                  </ThemedText>
                  <ThemedText style={styles.characterTitle}>
                    {character.title}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>

          <ThemedView
            style={[styles.footer, { backgroundColor: "transparent" }]}
          >
            <Pressable
              style={[
                styles.continueButton,
                !selectedCharacter && styles.continueButtonDisabled,
              ]}
              disabled={!selectedCharacter}
            >
              <ThemedText
                style={[
                  styles.continueButtonText,
                  !selectedCharacter && styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
      </ThemedView>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  title: {
    fontSize: FontSizes.xxl,
    color: Colors.cream,
    textAlign: "center",
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
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
    aspectRatio: 3 / 4,
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: Colors.cream,
  },
  characterImage: {
    width: "100%",
    height: "80%",
  },
  characterInfo: {
    padding: Spacing.sm,
    height: "20%",
    justifyContent: "center",
  },
  characterName: {
    textAlign: "center",
    fontSize: FontSizes.md,
    color: Colors.cream,
    fontWeight: "600",
  },
  characterTitle: {
    textAlign: "center",
    fontSize: FontSizes.sm,
    color: Colors.cream,
    opacity: 0.8,
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
  continueButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  continueButtonTextDisabled: {
    opacity: 0.5,
  },
});
