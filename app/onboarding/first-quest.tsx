import { StyleSheet, View, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { QuestCard } from "@/components/QuestCard";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
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

const AnimatedQuestCard = Animated.createAnimatedComponent(QuestCard);

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
    console.log("first quest screen mounted");
  }, []);

  // Start animations when component mounts
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
          source={require("@/assets/images/onboarding-bg-1.jpg")}
          style={layoutStyles.backgroundImage}
          resizeMode="cover"
        />
        <View style={layoutStyles.darkOverlay} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.header, headerStyle]}>
          <ThemedText type="title">Welcome to unQuest</ThemedText>
          <ThemedText type="subtitle">
            Your journey to mindful living begins here
          </ThemedText>
        </Animated.View>

        <View style={layoutStyles.centeredContent}>
          <ThemedText type="body">
            In unQuest, you'll embark on a unique adventure where the real
            challenge is stepping away from your device. Each quest is an
            opportunity to reconnect with the world around you.
          </ThemedText>

          <AnimatedQuestCard style={[styles.questCard, questCardStyle]}>
            <ThemedText type="title">{firstQuest.title}</ThemedText>
            <ThemedText type="body">{firstQuest.description}</ThemedText>
            <View style={styles.questDetails}>
              <ThemedText type="body">
                Duration: {firstQuest.durationMinutes} minutes
              </ThemedText>
              <ThemedText type="body">
                Reward: {firstQuest.reward.xp} XP
              </ThemedText>
            </View>
          </AnimatedQuestCard>

          <Animated.View style={[styles.footer, buttonStyle]}>
            <Pressable
              style={({ pressed }) => [
                buttonStyles.primary,
                pressed && buttonStyles.primaryPressed,
              ]}
              onPress={handleAcceptQuest}
            >
              <ThemedText type="bodyBold">Begin Your First Quest</ThemedText>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  questCard: {
    marginVertical: Spacing.xl,
  },
  questDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  questDuration: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    opacity: 0.9,
  },
  questReward: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    opacity: 0.9,
  },
  footer: {
    width: "100%",
    marginTop: "auto",
  },
});
