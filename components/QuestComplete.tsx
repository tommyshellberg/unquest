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
  const headerOpacity = useSharedValue(0);
  const storyOpacity = useSharedValue(0);
  const rewardOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const storyStyle = useAnimatedStyle(() => ({
    opacity: storyOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rewardOpacity.value,
  }));

  useEffect(() => {
    let isMounted = true;

    // Initial celebration animations
    scale.value = withSequence(withSpring(1.2), withSpring(1));

    headerOpacity.value = withDelay(450, withTiming(1, { duration: 1000 }));
    storyOpacity.value = withDelay(1000, withTiming(1, { duration: 1000 }));
    // Reward text fade in (6000ms -> 4000ms delay)
    rewardOpacity.value = withDelay(4000, withTiming(1, { duration: 1000 }));

    // Button slides up and fades in last (6600ms -> 4500ms delay)
    buttonOpacity.value = withDelay(4500, withTiming(1, { duration: 625 }));
    buttonTranslateY.value = withDelay(4500, withSpring(0));

    return () => {
      isMounted = false;

      // Cancel animations
      scale.value = withSpring(0);

      // Cancel animations
      cancelAnimation(scale);
      cancelAnimation(headerOpacity);
      cancelAnimation(storyOpacity);
      cancelAnimation(rewardOpacity);
      cancelAnimation(buttonOpacity);
      cancelAnimation(buttonTranslateY);
    };
  }, []);

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
        <Animated.View style={headerStyle}>
          <ThemedText type="title">Quest Complete!</ThemedText>
          <ThemedText type="subtitle">A Tale of Adventure</ThemedText>
        </Animated.View>

        <Animated.View style={[storyStyle, { flex: 1 }]}>
          <StoryNarration story={story} questId={quest.id} />
        </Animated.View>

        <View style={styles.footer}>
          <Animated.View style={rewardStyle}>
            <ThemedText type="bodyBold" style={styles.footerText}>
              Reward: {quest.reward.xp} XP
            </ThemedText>
          </Animated.View>

          <Animated.View style={buttonStyle}>
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
          </Animated.View>
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
