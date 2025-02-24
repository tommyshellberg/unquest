import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { QuestCard } from "@/components/QuestCard";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { buttonStyles } from "@/styles/buttons";
export default function ActiveQuestScreen() {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const insets = useSafeAreaInsets();
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const cancelQuest = useQuestStore((state) => state.failQuest);
  // Return early if there is no active quest.
  if (!activeQuest) return null;

  // Timer logic: update the remaining time every second.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timeElapsed = (now - activeQuest.startTime) / 1000;
      const totalDuration = activeQuest.durationMinutes * 60;
      const timeLeft = totalDuration - timeElapsed;

      if (timeLeft <= 0) {
        clearInterval(timer);
        // @todo: do we need this at all or can the background task do it all?
        completeQuest();
        // redirect to the Home screen for now (will be replaced with a quest complete screen)
        // make sure to redirect after interactions and state are updated.
        setTimeout(() => {
          router.replace("/home");
        }, 1000);
      } else {
        setRemainingMinutes(Math.floor(timeLeft / 60));
        setRemainingSeconds(Math.floor(timeLeft % 60));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuest]);

  // Header animation using react-native-reanimated.
  const headerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const timerOpacity = useSharedValue(0);
  const timerScale = useSharedValue(0.9);
  const instructionsOpacity = useSharedValue(0);
  const instructionsScale = useSharedValue(0.9);
  const activitiesOpacity = useSharedValue(0);
  const activitiesScale = useSharedValue(0.9);
  const questTitleOpacity = useSharedValue(0);
  const questTitleScale = useSharedValue(0.9);
  const descriptionOpacity = useSharedValue(0);
  const descriptionScale = useSharedValue(0.9);
  const cancelQuestButtonOpacity = useSharedValue(0);
  const cancelQuestButtonScale = useSharedValue(0.9);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerScale.value = withTiming(1, { duration: 500 });
    timerOpacity.value = withDelay(1500, withTiming(1, { duration: 500 }));
    timerScale.value = withDelay(1500, withTiming(1, { duration: 500 }));
    questTitleOpacity.value = withDelay(1500, withTiming(1, { duration: 500 }));
    questTitleScale.value = withDelay(1500, withTiming(1, { duration: 500 }));
    instructionsOpacity.value = withDelay(
      2500,
      withTiming(1, { duration: 500 })
    );
    instructionsScale.value = withDelay(2500, withTiming(1, { duration: 500 }));
    activitiesOpacity.value = withDelay(3500, withTiming(1, { duration: 500 }));
    activitiesScale.value = withDelay(3500, withTiming(1, { duration: 500 }));
    descriptionOpacity.value = withDelay(
      1500,
      withTiming(1, { duration: 500 })
    );
    descriptionScale.value = withDelay(1500, withTiming(1, { duration: 500 }));
    cancelQuestButtonOpacity.value = withDelay(
      4500,
      withTiming(1, { duration: 500 })
    );
    cancelQuestButtonScale.value = withDelay(
      4500,
      withTiming(1, { duration: 500 })
    );
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
    transform: [{ scale: timerScale.value }],
    delay: 1500,
  }));

  const instructionsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: instructionsOpacity.value,
    transform: [{ scale: instructionsScale.value }],
  }));

  const activitiesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: activitiesOpacity.value,
    transform: [{ scale: activitiesScale.value }],
  }));

  const questTitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: questTitleOpacity.value,
    transform: [{ scale: questTitleScale.value }],
  }));

  const descriptionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ scale: descriptionScale.value }],
  }));

  const cancelQuestButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cancelQuestButtonOpacity.value,
    transform: [{ scale: cancelQuestButtonScale.value }],
  }));

  const exampleActivities = [
    { description: "Take a relaxing walk outside." },
    { description: "Catch up with someone you care about." },
    { description: "Read a book or write in a journal." },
  ];

  return (
    <View style={styles.fullScreen}>
      {/* Full-screen Background Image */}
      <Image
        source={require("@/assets/images/background/active-quest.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* BlurView for a subtle overlay effect */}
      <BlurView intensity={30} tint="regular" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.contentContainer,
          {
            paddingTop: insets.top + Spacing.lg,
          },
        ]}
      >
        <StatusBar hidden />
        <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
          <ThemedText type="title">Active Quest</ThemedText>
        </Animated.View>

        <QuestCard style={{ backgroundColor: Colors.background.light }}>
          {/* Quest details inside the card */}
          <Animated.View style={questTitleAnimatedStyle}>
            <ThemedText type="subtitle" style={styles.questTitle}>
              {activeQuest.title}
            </ThemedText>
          </Animated.View>
          <View
            style={{
              borderBottomColor: Colors.primary,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: Spacing.md,
            }}
          />
          <Animated.View style={timerAnimatedStyle}>
            <ThemedText type="bodyBold" style={styles.timer}>
              Time Remaining: {remainingMinutes}:
              {remainingSeconds.toString().padStart(2, "0")}
            </ThemedText>
          </Animated.View>
          <Animated.View style={descriptionAnimatedStyle}>
            <ThemedText type="body" style={styles.instructions}>
              {activeQuest.description}
            </ThemedText>
          </Animated.View>
        </QuestCard>

        <Animated.View
          style={[styles.instructionsContainer, instructionsAnimatedStyle]}
        >
          <ThemedText type="body" style={styles.instructions}>
            Close the app and enjoy some time away from the screen. Here are
            some ideas:
          </ThemedText>
        </Animated.View>
        <FlatList
          data={exampleActivities}
          renderItem={({ item }) => (
            <Animated.View
              style={[styles.activityItem, activitiesAnimatedStyle]}
            >
              <ThemedText type="body" style={styles.activityItem}>
                - {item.description}
              </ThemedText>
            </Animated.View>
          )}
          keyExtractor={(item) => item.description}
        />
        <Animated.View
          style={[
            cancelQuestButtonAnimatedStyle,
            { marginBottom: insets.bottom + Spacing.lg },
          ]}
        >
          <Pressable onPress={() => cancelQuest()} style={buttonStyles.primary}>
            <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
              Cancel Quest
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  timer: {
    ...Typography.bodyBold,
    marginBottom: Spacing.lg,
  },
  questTitle: {
    ...Typography.subtitle,
  },
  instructions: {
    ...Typography.body,
    marginVertical: Spacing.md,
  },
  activityItem: {
    marginBottom: Spacing.sm,
  },
  instructionsContainer: {
    marginBottom: Spacing.lg,
  },
  cancelQuestButton: {
    ...buttonStyles.primary,
  },
});
