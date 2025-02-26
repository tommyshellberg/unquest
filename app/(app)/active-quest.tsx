import React, { useEffect } from "react";
import { View, StyleSheet, Image, StatusBar, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { QuestCard } from "@/components/QuestCard";
import { Colors, Spacing, Typography, FontSizes } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { buttonStyles } from "@/styles/buttons";

export default function ActiveQuestScreen() {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const pendingQuest = useQuestStore((state) => state.pendingQuest);
  const insets = useSafeAreaInsets();
  const cancelQuest = useQuestStore((state) => state.cancelQuest);

  // Determine if we're in pending state
  const isPending = !!pendingQuest;

  // Get the quest to display (either pending or active)
  const displayQuest = pendingQuest || activeQuest;

  // Header animation using react-native-reanimated
  const headerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);

  useEffect(() => {
    // Simple animation sequence
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerScale.value = withTiming(1, { duration: 500 });
    cardOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    cardScale.value = withDelay(500, withTiming(1, { duration: 500 }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    buttonScale.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const handleCancelQuest = () => {
    cancelQuest();
  };

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
          <ThemedText type="title">Quest Ready</ThemedText>
        </Animated.View>

        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <QuestCard style={{ backgroundColor: Colors.background.light }}>
            <ThemedText type="subtitle" style={styles.questTitle}>
              {displayQuest?.title}
            </ThemedText>

            <View style={styles.divider} />

            <ThemedText type="bodyBold" style={styles.lockInstruction}>
              Lock your phone to begin your quest
            </ThemedText>

            <ThemedText type="body" style={styles.description}>
              Your character is ready to embark on their journey, but they need
              you to put your phone away first. The quest will begin when your
              phone is locked.
            </ThemedText>

            <View style={styles.divider} />

            <ThemedText type="bodyLight" style={styles.warning}>
              Remember, unlocking your phone before the quest is complete will
              result in failure.
            </ThemedText>
          </QuestCard>
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View
          style={[
            buttonAnimatedStyle,
            { marginBottom: insets.bottom + Spacing.lg },
          ]}
        >
          <Pressable onPress={handleCancelQuest} style={buttonStyles.primary}>
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
    marginBottom: Spacing.xl,
  },
  cardContainer: {
    flex: 0,
  },
  questTitle: {
    ...Typography.subtitle,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  lockInstruction: {
    fontSize: FontSizes.lg,
    textAlign: "center",
    marginBottom: Spacing.lg,
    color: Colors.primary,
  },
  description: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  warning: {
    ...Typography.body,
    textAlign: "center",
    fontStyle: "italic",
  },
  divider: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: Spacing.md,
  },
  spacer: {
    flex: 1,
  },
});
