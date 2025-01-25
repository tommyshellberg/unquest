import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { Quest } from "@/store/types";
import { LevelProgress } from "./LevelProgress";
import { useCharacterStore } from "@/store/character-store";

type Props = {
  quest: Quest;
  story: string;
  onClaim: () => void;
};

export function QuestComplete({ quest, story, onClaim }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const storyProgress = useSharedValue(0);
  const character = useCharacterStore((state) => state.character);

  // Split story into sentences for animated reveal
  const sentences = story.split(/(?<=[.!?])\s+/);

  useEffect(() => {
    // Initial celebration animations
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    opacity.value = withDelay(300, withSpring(1));

    // Animate story reveal
    storyProgress.value = withDelay(
      1000,
      withTiming(1, {
        duration: 3000, // Adjust timing for desired reveal speed
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Create animated styles for each sentence
  const sentenceStyles = sentences.map((_, index) => {
    return useAnimatedStyle(() => {
      const sentenceOpacity = interpolate(
        storyProgress.value,
        [index / sentences.length, (index + 0.5) / sentences.length],
        [0, 1]
      );

      const translateY = interpolate(
        storyProgress.value,
        [index / sentences.length, (index + 0.5) / sentences.length],
        [20, 0]
      );

      return {
        opacity: sentenceOpacity,
        transform: [{ translateY }],
      };
    });
  });

  const questDuration = quest.durationMinutes;

  if (character) {
    return (
      <LevelProgress
        character={character}
        xpGained={quest.reward.xp}
        onComplete={onClaim}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, contentStyle]}>
        <Animated.View style={[styles.celebrationCircle, animatedStyle]}>
          <ThemedText style={styles.celebrationEmoji}>🎉</ThemedText>
        </Animated.View>

        <ThemedText style={styles.title}>Quest Complete!</ThemedText>
        <ThemedText style={styles.subtitle}>
          A Tale of {character?.name}'s Adventure
        </ThemedText>

        <View style={styles.storyCard}>
          {sentences.map((sentence, index) => (
            <Animated.View key={index} style={sentenceStyles[index]}>
              <ThemedText style={styles.storyText}>{sentence} </ThemedText>
            </Animated.View>
          ))}
        </View>

        <Animated.View style={[styles.rewardCard, contentStyle]}>
          <ThemedText style={styles.rewardText}>
            Reward: {quest.reward.xp} XP
          </ThemedText>
        </Animated.View>

        <Pressable
          style={({ pressed }) => [
            styles.claimButton,
            pressed && styles.claimButtonPressed,
          ]}
          onPress={onClaim}
        >
          <ThemedText style={styles.claimButtonText}>
            Continue Journey
          </ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.xl,
    backgroundColor: Colors.background.light,
  },
  content: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.forest,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    textAlign: "center",
    opacity: 0.9,
  },
  storyCard: {
    backgroundColor: Colors.cream,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.mist,
  },
  storyText: {
    fontSize: FontSizes.md,
    color: Colors.stone,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
  rewardCard: {
    backgroundColor: Colors.forest,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  rewardText: {
    fontSize: FontSizes.lg,
    color: Colors.cream,
    textAlign: "center",
    fontWeight: "bold",
  },
  claimButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.xl,
  },
  claimButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  claimButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  celebrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.forest,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  celebrationEmoji: {
    fontSize: 50,
  },
});
