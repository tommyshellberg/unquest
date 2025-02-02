import { Image, StyleSheet, View, ScrollView, Pressable } from "react-native";
import Animated, {
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { StoryNarration } from "./StoryNarration";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { Quest } from "@/store/types";

type Props = {
  quest: Quest;
  story: string;
  onClaim: () => void;
};

// @todo: scrolling is not working.

export function QuestComplete({ quest, story, onClaim }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const storyProgress = useSharedValue(0);

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

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image
          source={require("@/assets/images/quest-completed-bg.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          <ThemedText style={styles.title} type="title">
            Quest Complete!
          </ThemedText>
          <ThemedText style={styles.subtitle}>A Tale of Adventure</ThemedText>

          <StoryNarration story={story} questId={quest.id} />

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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Adjust opacity as needed
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
    color: Colors.forest,
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
