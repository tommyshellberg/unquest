import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  withSpring,
  withSequence,
  withDelay,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { Quest } from "@/store/types";
import { LevelProgress } from "./LevelProgress";
import { useCharacterStore } from "@/store/character-store";

type Props = {
  quest: Quest;
  onClaim: () => void;
};

export function QuestComplete({ quest, onClaim }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [showingProgress, setShowingProgress] = useState(false);
  const character = useCharacterStore((state) => state.character);

  useEffect(() => {
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    opacity.value = withDelay(300, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const questDuration = quest.durationMinutes;

  const handleClaim = () => {
    setShowingProgress(true);
  };

  if (showingProgress && character) {
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
          Congratulations, brave adventurer!
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.achievementText}>
            You successfully stayed away from your phone for{" "}
            {questDuration >= 1
              ? `${questDuration} minutes`
              : `${Math.round(questDuration * 60)} seconds`}
            !
          </ThemedText>

          <ThemedText style={styles.rewardText}>
            Reward: {quest.reward.xp} XP
          </ThemedText>

          <ThemedText style={styles.encouragementText}>
            Every moment spent away from your screen is a step toward mindful
            living. Your character has grown stronger through your dedication.
          </ThemedText>
        </ThemedView>

        <Pressable
          style={({ pressed }) => [
            styles.claimButton,
            pressed && styles.claimButtonPressed,
          ]}
          onPress={handleClaim}
        >
          <ThemedText style={styles.claimButtonText}>Claim XP</ThemedText>
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
  card: {
    backgroundColor: Colors.forest,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  achievementText: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    fontWeight: "600",
  },
  encouragementText: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
  },
  claimButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.md,
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
  rewardText: {
    fontSize: FontSizes.lg,
    color: Colors.cream,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: Spacing.sm,
  },
});
