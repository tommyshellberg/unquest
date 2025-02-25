import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { Character } from "@/store/types";
import { CHARACTERS } from "@/constants/characters";
import { useQuestStore } from "@/store/quest-store";
import { TAB_BAR_HEIGHT } from "@/app/_layout";
import { layoutStyles } from "@/styles/layouts";

type Props = {
  character: Character;
  xpGained?: number;
  onComplete?: () => void;
};

export function CharacterProgress({
  character,
  xpGained = 0,
  onComplete,
}: Props) {
  const progressWidth = useSharedValue(0);
  const xpCounter = useSharedValue(0);
  const scale = useSharedValue(1);
  const currentLevel = useSharedValue(character.level);

  // Get quest data
  const completedQuests = useQuestStore((state) => state.getCompletedQuests());

  // Calculate total minutes from completed quests
  const totalMinutesOffPhone = completedQuests.reduce(
    (total, quest) => total + quest.durationMinutes,
    0
  );

  // Find character details from CHARACTERS array
  const characterDetails = CHARACTERS.find((c) => c.id === character.type);

  // Calculate final XP and potential level up
  const totalXP = character.currentXP + xpGained;
  const willLevelUp = totalXP >= character.xpToNextLevel;
  const finalProgress = willLevelUp ? 1 : totalXP / character.xpToNextLevel;

  useEffect(() => {
    // Initial entrance animation
    scale.value = withSequence(withSpring(1.1), withSpring(1));

    // Start XP animation sequence
    const animateXP = () => {
      // Animate progress bar to full
      progressWidth.value = withTiming(finalProgress, { duration: 1500 });

      // Count up XP
      xpCounter.value = withTiming(xpGained, {
        duration: 1500,
      });

      // If leveling up, trigger level up animation after progress bar fills
      if (willLevelUp) {
        setTimeout(() => {
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          currentLevel.value = withSpring(character.level + 1);
        }, 1500);
      }
    };

    animateXP();
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={layoutStyles.fullScreen}>
      <View style={[layoutStyles.backgroundImageContainer, { opacity: 0.2 }]}>
        <Image
          source={characterDetails?.image}
          style={layoutStyles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.characterInfo}>
          <ThemedText type="title">{character.name}</ThemedText>
          <ThemedText type="subtitle">
            Level {character.level} {character.type}
          </ThemedText>
        </View>
        <View>
          <View>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                fontSize: FontSizes.lg,
                textAlign: "center",
              }}
            >
              Character Stats
            </ThemedText>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <ThemedText type="title">{completedQuests.length}</ThemedText>
              <ThemedText type="body">Quests Completed</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <ThemedText type="title">{totalMinutesOffPhone}</ThemedText>
              <ThemedText type="body">Minutes Saved</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.xpSection}>
          {xpGained > 0 && (
            <Animated.Text style={styles.xpGained}>
              +{Math.floor(xpCounter.value)} XP
            </Animated.Text>
          )}

          <View style={styles.characterProgressContainer}>
            <View style={styles.levelLabels}>
              <ThemedText type="body">Level {character.level}</ThemedText>
              <ThemedText type="body">Level {character.level + 1}</ThemedText>
            </View>

            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, progressStyle]} />
              <View style={styles.progressMarkers}>
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.marker,
                      i === 0 && styles.markerStart,
                      i === 4 && styles.markerEnd,
                    ]}
                  />
                ))}
              </View>
            </View>

            <ThemedText style={styles.xpText}>
              {character.currentXP} / {character.xpToNextLevel} XP
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "space-between",
    paddingBottom: TAB_BAR_HEIGHT + Spacing.xl,
  },
  characterInfo: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  xpSection: {
    width: "100%",
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  xpGained: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.text.light,
  },
  characterProgressContainer: {
    width: "100%",
    gap: Spacing.xs,
  },
  levelLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
  },
  levelLabel: {
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  progressBarContainer: {
    width: "100%",
    height: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: BorderRadius.pill,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.cream,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  progressMarkers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  marker: {
    width: 2,
    height: "30%",
    backgroundColor: Colors.background.dark,
    opacity: 0.2,
  },
  markerStart: {
    opacity: 0,
  },
  markerEnd: {
    opacity: 0,
  },
  xpText: {
    fontSize: FontSizes.md,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
  },
  stat: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: "80%",
    opacity: 0.2,
    marginHorizontal: Spacing.lg,
  },
});
