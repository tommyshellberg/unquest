import { StyleSheet, View, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { QuestCard } from "@/components/QuestCard";
import { Colors, FontSizes, Spacing, Typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useQuestStore } from "@/store/quest-store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { AVAILABLE_QUESTS } from "../data/quests";
import React, { useEffect } from "react";
import { layoutStyles } from "@/styles/layouts";
import { buttonStyles } from "@/styles/buttons";

export default function FirstQuestScreen() {
  const router = useRouter();
  const startQuest = useQuestStore((state) => state.startQuest);
  const firstQuest = AVAILABLE_QUESTS[0];

  // Animation values
  const headerOpacity = useSharedValue(0);
  const welcomeScale = useSharedValue(0.9);
  const questCardOpacity = useSharedValue(0);
  const questCardTranslateY = useSharedValue(50);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    welcomeScale.value = withSequence(
      withDelay(300, withSpring(1.1)),
      withSpring(1)
    );
    questCardOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    questCardTranslateY.value = withDelay(800, withSpring(0));
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));
  }, []);

  const handleAcceptQuest = () => {
    startQuest({ ...firstQuest, startTime: Date.now() });
    router.push("/home");
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: welcomeScale.value }],
  }));

  const questCardStyle = useAnimatedStyle(() => ({
    opacity: questCardOpacity.value,
    transform: [{ translateY: questCardTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={layoutStyles.fullScreen}>
      <View style={layoutStyles.backgroundImageContainer}>
        <Image
          source={require("@/assets/images/background/onboarding.jpg")}
          style={layoutStyles.backgroundImage}
          resizeMode="cover"
        />
        <View style={[layoutStyles.darkOverlay, styles.lightOverlay]} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.header, headerStyle]}>
          <ThemedText type="title">Welcome to unQuest</ThemedText>
          <ThemedText
            type="bodyBold"
            style={{ ...Typography.bodyBold, color: Colors.text.light }}
          >
            Your journey to mindful living
          </ThemedText>
        </Animated.View>

        <View style={styles.description}>
          <ThemedText type="body">
            In unQuest, you'll embark on a unique adventure where the real
            challenge is stepping away from your device.
          </ThemedText>
          <ThemedText type="body">
            Each quest is an opportunity to reconnect with the world around you.
          </ThemedText>
          <ThemedText type="body">
            When you complete a quest, you'll earn XP and uncover the story of
            Vaedros, a kingdom thrown into disarray.
          </ThemedText>
        </View>

        <Animated.View style={questCardStyle}>
          <QuestCard>
            <View style={styles.questContent}>
              <ThemedText type="subtitle" style={styles.questTitle}>
                {firstQuest.title}
              </ThemedText>
              <ThemedText type="body" style={styles.questDescription}>
                {firstQuest.description}
              </ThemedText>
              <View style={styles.questReward}>
                <ThemedText type="body" style={styles.questDuration}>
                  Lock your phone and don't use it for{" "}
                  {firstQuest.durationMinutes} minutes to complete this quest.
                </ThemedText>
                <ThemedText type="body">
                  Reward: {firstQuest.reward.xp} XP
                </ThemedText>
              </View>
            </View>
          </QuestCard>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              styles.button,
              pressed && buttonStyles.primaryPressed,
            ]}
            onPress={handleAcceptQuest}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              Start First Quest
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lightOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Lighter overlay
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  description: {
    marginBottom: Spacing.lg,
  },
  questContent: {
    padding: Spacing.sm,
  },
  questTitle: {
    ...Typography.subtitle,
    fontSize: FontSizes.md,
    color: Colors.cream,
    marginBottom: Spacing.md,
  },
  questDuration: {
    color: Colors.cream,
    opacity: 0.8,
    marginBottom: Spacing.md,
  },
  questDescription: {
    color: Colors.cream,
    marginBottom: Spacing.xl,
  },
  questReward: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cream + "20",
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  button: {
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.cream,
    textAlign: "center",
  },
});
