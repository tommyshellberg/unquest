import { StyleSheet, View, ScrollView, Pressable } from "react-native";
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          <ThemedText style={styles.celebrationEmoji} type="subtitle">
            🎉
          </ThemedText>

          <ThemedText style={styles.title} type="title">
            Quest Complete!
          </ThemedText>
          <ThemedText style={styles.subtitle}>A Tale of Adventure</ThemedText>

          {sentences.map((sentence, index) => (
            <Animated.View key={index} style={styles.storyLine}>
              <ThemedText style={styles.storyText}>{sentence}</ThemedText>
            </Animated.View>
          ))}

          <View style={styles.footer}>
            <ThemedText style={styles.rewardText}>
              Reward: {quest.reward.xp} XP
            </ThemedText>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continueButtonPressed,
              ]}
              onPress={onClaim}
            >
              <ThemedText style={styles.continueButtonText}>
                Continue Journey
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  celebrationEmoji: {
    fontSize: 40,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.forest,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: Spacing.xl,
  },
  storyLine: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  storyText: {
    fontSize: FontSizes.md,
    color: Colors.stone,
    lineHeight: 24,
    fontStyle: "italic",
  },
  footer: {
    width: "100%",
    marginTop: "auto",
    gap: Spacing.lg,
  },
  rewardText: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
    width: "100%",
  },
  continueButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  continueButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
    textAlign: "center",
  },
});
