import { Image, StyleSheet, View, ScrollView, Pressable } from "react-native";
import Animated, {
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { StoryNarration } from "./StoryNarration";
import { Spacing, Typography } from "@/constants/theme";
import { layoutStyles } from "@/styles/layouts";
import { Quest } from "@/store/types";
import { buttonStyles } from "@/styles/buttons";

type Props = {
  quest: Quest;
  story: string;
  onClaim: () => void;
};

export function QuestComplete({ quest, story, onClaim }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const storyProgress = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;

    // Initial celebration animations
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    opacity.value = withDelay(300, withSpring(1));

    // Animate story reveal
    storyProgress.value = withDelay(
      1000,
      withTiming(1, {
        duration: 3000,
      })
    );

    return () => {
      isMounted = false;

      // Cancel animations
      scale.value = withSpring(0);
      opacity.value = withSpring(0);
      storyProgress.value = withSpring(0);

      // Cancel animations
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(storyProgress);
    };
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={layoutStyles.fullScreen}>
      <View style={layoutStyles.backgroundImageContainer}>
        <Image
          source={require("@/assets/images/background/quest-complete.jpg")}
          style={layoutStyles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      <View
        style={[layoutStyles.centeredContent, layoutStyles.contentContainer]}
      >
        <ThemedText type="title">Quest Complete!</ThemedText>
        <ThemedText type="subtitle">A Tale of Adventure</ThemedText>

        <StoryNarration story={story} questId={quest.id} />

        <View style={styles.footer}>
          <ThemedText type="bodyBold" style={styles.footerText}>
            Reward: {quest.reward.xp} XP
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              pressed && buttonStyles.primaryPressed,
            ]}
            onPress={onClaim}
          >
            <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
              Continue Journey
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    marginTop: "auto",
    gap: Spacing.lg,
  },
  footerText: {
    ...Typography.bodyBold,
    textAlign: "center",
  },
});
