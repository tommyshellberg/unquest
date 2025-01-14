import { useEffect } from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { Character } from "@/store/types";
import { CHARACTERS } from "@/constants/characters";

type Props = {
  character: Character;
  xpGained: number;
  onComplete: () => void;
};

export function LevelProgress({ character, xpGained, onComplete }: Props) {
  const progressWidth = useSharedValue(0);
  const xpCounter = useSharedValue(0);
  const scale = useSharedValue(1);
  const currentLevel = useSharedValue(character.level);

  // Find character details from CHARACTERS array
  const characterDetails = CHARACTERS.find((c) => c.id === character.type);

  // Calculate final XP and potential level up
  const totalXP = character.currentXP + xpGained;
  const willLevelUp = totalXP >= character.xpToNextLevel;
  const finalProgress = willLevelUp ? 1 : totalXP / character.xpToNextLevel;

  useEffect(() => {
    // Initial entrance animation
    scale.value = withSequence(withSpring(1.1), withSpring(1));

    // Start XP animation sequence
    const animateXP = () => {
      // Animate progress bar to full
      progressWidth.value = withTiming(finalProgress, { duration: 1500 });

      // Count up XP
      xpCounter.value = withTiming(xpGained, {
        duration: 1500,
      });

      // If leveling up, trigger level up animation after progress bar fills
      if (willLevelUp) {
        setTimeout(() => {
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          currentLevel.value = withSpring(character.level + 1);
        }, 1500);
      }
    };

    animateXP();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const levelTextStyle = useAnimatedStyle(() => ({
    fontSize: FontSizes.lg,
    color: Colors.forest,
    opacity: 0.9,
    text: `Level ${Math.floor(currentLevel.value)}`,
  }));

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <View style={styles.characterInfo}>
        <View style={styles.characterImageContainer}>
          {characterDetails && (
            <Image
              source={characterDetails.image}
              style={styles.characterImage}
              resizeMode="contain"
            />
          )}
          <Animated.View
            style={[
              styles.characterImageOverlay,
              { transform: [{ scale: scale }] },
            ]}
          />
        </View>
        <ThemedText style={styles.characterName}>{character.name}</ThemedText>
        <Animated.Text style={levelTextStyle} />
      </View>

      <View style={styles.xpSection}>
        <Animated.Text style={[styles.xpGained]}>
          +{Math.floor(xpCounter.value)} XP
        </Animated.Text>

        <View style={styles.levelProgressContainer}>
          <View style={styles.levelLabels}>
            <ThemedText style={styles.levelLabel}>
              Level {character.level}
            </ThemedText>
            <ThemedText style={styles.levelLabel}>
              Level {character.level + 1}
            </ThemedText>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
            <View style={styles.progressMarkers}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.marker,
                    i === 0 && styles.markerStart,
                    i === 4 && styles.markerEnd,
                  ]}
                />
              ))}
            </View>
          </View>

          <ThemedText style={styles.xpText}>
            {willLevelUp
              ? `${character.xpToNextLevel} / ${character.xpToNextLevel} XP`
              : `${totalXP} / ${character.xpToNextLevel} XP`}
          </ThemedText>
        </View>
      </View>

      {willLevelUp && (
        <Animated.View
          style={[
            styles.levelUpContainer,
            {
              transform: [{ scale: scale }],
            },
          ]}
        >
          <ThemedText style={styles.levelUpText}>Level Up!</ThemedText>
          <ThemedText style={styles.newLevelText}>
            You've reached level {character.level + 1}
          </ThemedText>
          <ThemedText style={styles.levelUpBonus}>
            Your mindfulness grows stronger
          </ThemedText>
        </Animated.View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.continueButtonPressed,
        ]}
        onPress={onComplete}
      >
        <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  characterInfo: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  characterName: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.forest,
  },
  levelText: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    opacity: 0.9,
  },
  xpSection: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.md,
  },
  xpGained: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.primary,
  },
  levelProgressContainer: {
    width: "100%",
    gap: Spacing.xs,
  },
  levelLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  levelLabel: {
    fontSize: FontSizes.sm,
    color: Colors.forest,
    fontWeight: "600",
  },
  progressBarContainer: {
    width: "100%",
    height: 24,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.pill,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  progressMarkers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  marker: {
    width: 2,
    height: "30%",
    backgroundColor: Colors.background.dark,
    opacity: 0.2,
  },
  markerStart: {
    opacity: 0,
  },
  markerEnd: {
    opacity: 0,
  },
  xpText: {
    fontSize: FontSizes.sm,
    color: Colors.forest,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  levelUpContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  levelUpText: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.primary,
  },
  newLevelText: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
  },
  continueButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  continueButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  levelUpBonus: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    opacity: 0.8,
    fontStyle: "italic",
    marginTop: Spacing.sm,
  },
  characterImageContainer: {
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
    position: "relative",
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  characterImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: 0.5,
  },
});
