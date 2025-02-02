import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import { ThemedText } from "./ThemedText";
import { FontSizes, Spacing, Colors } from "@/constants/theme";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
  withSpring,
} from "react-native-reanimated";

type Props = {
  story: string;
  questId: string;
};

// Average reading speed (words per second)
const WORDS_PER_SECOND = 2.5;
// Duration of each word's fade-in animation
const FADE_DURATION = 500;
// Amount to slide up (in pixels)
const SLIDE_UP_DISTANCE = 10;

export function StoryNarration({ story, questId }: Props) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  // Split story into words and clean up extra whitespace
  const words = story.replace(/\s+/g, " ").trim().split(" ");

  // Create arrays of shared values for opacity and translateY
  const wordOpacities = words.map(() => useSharedValue(0));
  const wordTranslateY = words.map(() => useSharedValue(SLIDE_UP_DISTANCE));

  // Opacity for the text container
  const containerOpacity = useSharedValue(0);

  async function playSound() {
    try {
      // Load the audio file based on the quest ID
      const audioFile = getAudioFileForQuest(questId);
      if (!audioFile) return;

      const { sound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: true,
      });
      setSound(sound);
      setIsPlaying(true);

      // Handle audio completion
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  // Cleanup function to stop and unload audio
  const stopAndUnloadSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error cleaning up sound:", error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const setupAndPlay = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false, // Changed to false
      });

      if (isMounted) {
        playSound();
        startTextReveal();
      }
    };

    setupAndPlay();

    // Cleanup function
    return () => {
      isMounted = false;
      stopAndUnloadSound();
    };
  }, []);

  const startTextReveal = () => {
    // Fade in the container
    containerOpacity.value = withSequence(
      withDelay(300, withTiming(1, { duration: 500 }))
    );

    // Create an array of animations
    const animations = words.map((_, index) => {
      return () => {
        wordOpacities[index].value = withTiming(1, { duration: FADE_DURATION });
        wordTranslateY[index].value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      };
    });

    // Start staggered animations
    const staggerDelay = 1000 / WORDS_PER_SECOND;
    setTimeout(() => {
      animations.forEach((anim, index) => {
        setTimeout(anim, index * staggerDelay);
      });
    }, 500); // Initial delay before starting animations
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.storyContainer}>
        {words.map((word, index) => {
          const wordStyle = useAnimatedStyle(() => ({
            opacity: wordOpacities[index].value,
            transform: [{ translateY: wordTranslateY[index].value }],
          }));

          return (
            <Animated.View
              key={index}
              style={[styles.wordContainer, wordStyle]}
            >
              <ThemedText style={styles.storyText}>{word}</ThemedText>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

// Helper function to map quest IDs to audio files
function getAudioFileForQuest(questId: string) {
  const audioMap: Record<string, any> = {
    "quest-1": require("../assets/audio/darkwood-awakening.mp3"),
    "quest-2": require("../assets/audio/hut-of-whispers.mp3"),
    "quest-3": require("../assets/audio/weary-crossing.mp3"),
    "quest-4": require("../assets/audio/arch-of-echoes.mp3"),
    "quest-5": require("../assets/audio/rugged-outcropping.mp3"),
    // Add more quest audio mappings as needed
  };

  return audioMap[questId];
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  storyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  wordContainer: {
    marginRight: 4,
    marginBottom: 4,
  },
  storyText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    fontStyle: "italic",
    color: Colors.forest,
  },
});
