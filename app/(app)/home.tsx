import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Button, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestComplete } from "@/components/QuestComplete";
import { QuestList } from "@/components/QuestList";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { useCharacterStore } from "@/store/character-store";
import { Quest, QuestCompletion, QuestTemplate } from "@/store/types";
import { router } from "expo-router";
import { layoutStyles } from "@/styles/layouts";
import { BlurView } from "expo-blur";
import { ErrorBoundary } from "react-error-boundary";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import {
  Provider as PaperProvider,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import customTheme from "@/constants/customTheme";

function ScreenErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Error in this screen:</Text>
      <Text>{error.message}</Text>
      <Pressable
        onPress={resetErrorBoundary}
        style={{
          padding: Spacing.md,
          backgroundColor: Colors.primary,
          borderRadius: BorderRadius.md,
        }}
      >
        <Text style={{ color: Colors.cream }}>Reload Screen</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const startQuest = useQuestStore((state) => state.startQuest);
  const refreshAvailableQuests = useQuestStore(
    (state) => state.refreshAvailableQuests
  );
  const availableQuests = useQuestStore((state) => state.availableQuests);

  const character = useCharacterStore((state) => state.character);
  const addXP = useCharacterStore((state) => state.addXP);

  const [showingCompletion, setShowingCompletion] = useState(false);
  const [currentCompletion, setCurrentCompletion] =
    useState<QuestCompletion | null>(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const subtitleOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const startQuestButtonOpacity = useSharedValue(0);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // Refresh available quests when there's no active quest
  useEffect(() => {
    console.log("activeQuest", activeQuest);
    if (!activeQuest) {
      console.log("no active quest, refreshing available quests");
      refreshAvailableQuests();
    } else {
      console.log("we have active quest, not refreshing available quests");
    }
  }, [activeQuest]);

  useEffect(() => {
    // Animate header, subtitle, and card regardless of whether activeQuest is truthy or not.
    headerOpacity.value = withDelay(450, withTiming(1, { duration: 1000 }));
    headerScale.value = withSequence(
      withDelay(450, withSpring(1.1)),
      withSpring(1)
    );

    subtitleOpacity.value = withDelay(1500, withTiming(1, { duration: 1000 }));

    cardOpacity.value = withDelay(2700, withTiming(1, { duration: 1000 }));
    cardTranslateY.value = withDelay(2700, withSpring(0));

    // Animate the start quest button
    startQuestButtonOpacity.value = withDelay(
      3600,
      withTiming(1, { duration: 625 })
    );
  }, [activeQuest]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const startQuestButtonStyle = useAnimatedStyle(() => ({
    opacity: startQuestButtonOpacity.value,
  }));

  // @todo: move quest complete to its own screen.
  const handleQuestComplete = (ignoreDuration = false) => {
    if (!character) return;
    const completion = completeQuest(ignoreDuration);
    if (completion) {
      setCurrentCompletion(completion);
      setShowingCompletion(true);
    }
  };

  const handleClaimReward = async () => {
    if (!currentCompletion || !character) return;

    try {
      // Add XP before completing quest
      addXP(currentCompletion.reward.xp);

      // Reset completion state
      setShowingCompletion(false);
      setCurrentCompletion(null);

      // Use router.replace to avoid stacking screens
      router.replace("/profile");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleSelectQuest = (quest: QuestTemplate) => {
    try {
      startQuest({ ...quest, startTime: Date.now() });
    } catch (error) {
      console.error("Error starting quest:", error);
    }
  };

  // New function to start the quest via the dedicated button.
  // It picks the first available quest.
  const handleStartQuest = () => {
    if (availableQuests.length > 0) {
      const questToStart = availableQuests[0];
      handleSelectQuest(questToStart);
    } else {
      console.warn("No available quest to start.");
    }
  };

  if (showingCompletion && currentCompletion) {
    return (
      <QuestComplete
        quest={currentCompletion}
        onClaim={handleClaimReward}
        story={currentCompletion.story}
      />
    );
  }

  return (
    <PaperProvider theme={customTheme}>
      <ErrorBoundary FallbackComponent={ScreenErrorFallback}>
        <View style={layoutStyles.backgroundImageContainer}>
          <Image
            source={require("@/assets/images/background/active-quest.jpg")}
            style={layoutStyles.backgroundImage}
            resizeMode="cover"
          />
        </View>
        <View style={layoutStyles.contentContainer}>
          <Animated.View
            style={[styles.header, headerStyle, { marginBottom: 0 }]}
          >
            <ThemedText type="title">Next Quest</ThemedText>
          </Animated.View>

          <Animated.View style={[styles.subtitle, subtitleStyle]}>
            <ThemedText type="subtitle">Continue your journey</ThemedText>
          </Animated.View>

          <Animated.View style={[styles.blurCard, cardStyle]}>
            <BlurView
              intensity={5}
              style={styles.blurContent}
              experimentalBlurMethod="dimezisBlurView"
            >
              {!activeQuest && (
                <View style={styles.availableQuestsContainer}>
                  {availableQuests.length > 0 ? (
                    <QuestList
                      quests={availableQuests}
                      onSelectQuest={handleSelectQuest}
                    />
                  ) : (
                    <ThemedView style={styles.noQuestsContainer}>
                      <ThemedText type="bodyLight">
                        No quests available at the moment. Complete your current
                        quest or check back later.
                      </ThemedText>
                    </ThemedView>
                  )}
                </View>
              )}
            </BlurView>
          </Animated.View>
        </View>
        {!activeQuest && availableQuests.length > 0 && (
          <Animated.View
            style={[
              styles.startQuestButtonContainer,
              startQuestButtonStyle,
              {
                bottom: insets.bottom + 80 + Spacing.md,
              },
            ]}
          >
            <Pressable
              onPress={handleStartQuest}
              style={[styles.startQuestButton]}
            >
              <ThemedText type="bodyBold" style={styles.startQuestButtonText}>
                Start Quest
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </ErrorBoundary>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  blurContent: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    alignItems: "center",
    marginVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  subtitle: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  questContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.lg,
  },
  instruction: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    textAlign: "center",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    lineHeight: 24,
    fontStyle: "italic",
  },
  availableQuestsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  noQuestsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  noQuestsText: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    lineHeight: 24,
  },
  startQuestButtonContainer: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
  },
  startQuestButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  startQuestButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
  headerText: {
    fontFamily: Typography.title.fontFamily,
    fontSize: Typography.title.fontSize,
    color: Colors.text.light,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    marginVertical: Spacing.lg,
  },
  cardTitle: {
    fontFamily: Typography.subtitle.fontFamily,
    fontSize: Typography.subtitle.fontSize,
    marginVertical: Spacing.md,
  },
  cardSubtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  bodyText: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
