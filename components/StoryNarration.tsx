import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
  ScrollView,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Spacing, Colors, Typography } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  story: string;
  questId: string;
};

export function StoryNarration({ story, questId }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to play the audio narration
  async function playSound() {
    if (soundRef.current) {
      // Sound is already loaded
      return;
    }
    try {
      // Stop any existing sound to prevent overlap
      await stopAndUnloadSound();

      // Load the audio file based on the quest ID
      const audioFile = getAudioFileForQuest(questId);
      if (!audioFile) return;

      const { sound: loadedSound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: true,
      });
      soundRef.current = loadedSound;
      setIsPlaying(true);

      // Handle audio completion
      loadedSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  const stopAndUnloadSound = async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();

        // Try to stop regardless of status
        try {
          await soundRef.current.stopAsync();
        } catch (stopError) {
          console.log("Stop error:", stopError);
        }

        // Try to unload regardless of status
        try {
          await soundRef.current.unloadAsync();
        } catch (unloadError) {
          console.log("Unload error:", unloadError);
        }
      } catch (error) {
        console.error("Error getting sound status:", error);
      } finally {
        // Force cleanup of the sound object
        if (soundRef.current) {
          soundRef.current.setOnPlaybackStatusUpdate(null);
          soundRef.current = null;
          setIsPlaying(false);
        }
      }
    }
  };

  // Handle app state change (e.g., app goes to background or foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, [soundRef.current]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState !== "active") {
      // App has gone to background
      if (soundRef.current) {
        try {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } catch (error) {
          console.error("Error pausing sound:", error);
        }
      }
    } else {
      // App has come to foreground
      if (soundRef.current) {
        // Delay resuming playback to allow audio focus to be acquired.
        setTimeout(async () => {
          try {
            await soundRef.current?.playAsync();
            setIsPlaying(true);
          } catch (error) {
            console.error("Error resuming sound:", error);
          }
        }, 300); // 300ms delay; adjust if necessary.
      }
    }
  };

  // Ensure cleanup happens when component unmounts
  useEffect(() => {
    return () => {
      stopAndUnloadSound().catch((error) =>
        console.error("Error cleaning up sound on unmount:", error)
      );
    };
  }, []);

  // Handle screen focus/unfocus
  useFocusEffect(
    useCallback(() => {
      playSound();

      return () => {
        // Make sure we wait for the cleanup to complete
        stopAndUnloadSound().catch((error) =>
          console.error("Error cleaning up sound on unfocus:", error)
        );
      };
    }, [questId])
  );

  // Helper function to map quest IDs to audio files
  function getAudioFileForQuest(questId: string) {
    const audioMap = {
      "quest-1": require("@/assets/audio/quest-1.mp3"),
      "quest-2": require("@/assets/audio/quest-2.mp3"),
      "quest-3": require("@/assets/audio/quest-3.mp3"),
      "quest-4": require("@/assets/audio/quest-4.mp3"),
      "quest-5": require("@/assets/audio/quest-5.mp3"),
    };

    return audioMap[questId as keyof typeof audioMap];
  }

  return (
    <View style={[styles.container]}>
      <BlurView
        intensity={50}
        tint="light"
        style={styles.blurCard}
        experimentalBlurMethod="dimezisBlurView"
      >
        {/* ScrollView */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="body" style={styles.text}>
            {story}
          </ThemedText>
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  blurCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    height: 80, // Adjust the height to control the gradient effect
    width: "100%",
  },
  contentContainer: {
    padding: Spacing.md,
  },
  text: {
    ...Typography.body,
    color: Colors.text.light,
    lineHeight: 24,
  },
});
