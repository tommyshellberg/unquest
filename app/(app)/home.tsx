import React, { useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestList } from "@/components/QuestList";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { QuestTemplate } from "@/store/types";
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
import { Provider as PaperProvider } from "react-native-paper";
import customTheme from "@/constants/customTheme";
import QuestTimer from "@/services/quest-timer";
import { getRefreshToken } from "@/services/auth";
import { getUserDetails } from "@/services/user";

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
  const refreshAvailableQuests = useQuestStore(
    (state) => state.refreshAvailableQuests
  );
  const availableQuests = useQuestStore((state) => state.availableQuests);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const subtitleOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const startQuestButtonOpacity = useSharedValue(0);

  // Refresh available quests when there's no active quest
  useEffect(() => {
    if (!activeQuest) {
      refreshAvailableQuests();
    }
  }, [activeQuest, refreshAvailableQuests]);

  useEffect(() => {
    // Test the authentication and user details fetch
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        console.log("Fetched user data:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once when component mounts

  // Initialize animations
  useEffect(() => {
    headerOpacity.value = withDelay(450, withTiming(1, { duration: 1000 }));
    headerScale.value = withSequence(
      withDelay(450, withSpring(1.1)),
      withSpring(1)
    );
    subtitleOpacity.value = withDelay(1500, withTiming(1, { duration: 1000 }));
    cardOpacity.value = withDelay(2700, withTiming(1, { duration: 1000 }));
    cardTranslateY.value = withDelay(2700, withSpring(0));
    startQuestButtonOpacity.value = withDelay(
      3600,
      withTiming(1, { duration: 625 })
    );
  }, []);

  // Animated styles
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

  const handleSelectQuest = async (quest: QuestTemplate) => {
    try {
      // First update the store to set pendingQuest
      useQuestStore.getState().prepareQuest(quest);

      // Then prepare the quest in the background task
      await QuestTimer.prepareQuest(quest);

      // Navigation should now happen automatically via the _layout.tsx effect
    } catch (error) {
      console.error("Error preparing quest:", error);
    }
  };

  const handleStartQuest = () => {
    if (availableQuests.length > 0) {
      handleSelectQuest(availableQuests[0]);
    }
  };

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
          <Animated.View style={[styles.header, headerStyle]}>
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
              style={styles.startQuestButton}
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
  header: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  subtitle: {
    alignItems: "center",
    marginBottom: Spacing.xl,
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
});
