import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Pressable,
  View,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { CHARACTERS } from "../../constants/characters";
import { useRouter } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { CharacterType } from "@/store/types";
import { useNavigation } from "@react-navigation/native";
import { buttonStyles } from "@/styles/buttons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

// Get screen dimensions and define card dimensions
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth * 0.75; // each card takes 75% of screen width
const snapInterval = cardWidth;

export default function ChooseCharacterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const createCharacter = useCharacterStore((state) => state.createCharacter);

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [inputName, setInputName] = useState<string>("");
  const [debouncedName, setDebouncedName] = useState<string>("");

  // Debounce the input name: update debouncedName 500ms after user stops typing.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(inputName);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputName]);

  // Shared values for animation: for scroll container and button
  const scrollContainerOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  // Animate the scroll container and Continue button based on a valid debouncedName.
  useEffect(() => {
    if (debouncedName.trim().length > 0) {
      scrollContainerOpacity.value = withTiming(1, { duration: 500 });
      buttonOpacity.value = withTiming(1, { duration: 500 });
    } else {
      scrollContainerOpacity.value = withTiming(0, { duration: 500 });
      buttonOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [debouncedName, scrollContainerOpacity, buttonOpacity]);

  // Animated styles for container and continue button.
  const animatedScrollStyle = useAnimatedStyle(() => ({
    opacity: scrollContainerOpacity.value,
    transform: [{ translateY: (1 - scrollContainerOpacity.value) * 20 }], // animate from 20px below
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: (1 - buttonOpacity.value) * 20 }],
  }));

  const handleContinue = () => {
    if (!selectedCharacter || !debouncedName.trim()) return;
    const selected = CHARACTERS.find((c) => c.id === selectedCharacter);
    if (!selected) return;
    // Pass the character's archetype from constants and the user-defined name.
    createCharacter(selected.id as CharacterType, debouncedName.trim());
    router.push("/onboarding/screen-time-goal");
  };

  // Hide header and drawer for onboarding flow
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false, // Disable swipe gesture for drawer
    });
  }, []);

  // New Card component for each character
  function Card({
    item,
    index,
  }: {
    item: (typeof CHARACTERS)[0];
    index: number;
  }) {
    const isSelected = selectedCharacter === item.id;
    return (
      <View style={styles.characterCardContainer}>
        <ThemedView
          style={[
            styles.card,
            isSelected ? styles.selectedCard : styles.inactiveCard,
          ]}
        >
          {/* Card Header: Display the character type */}
          <ThemedText type="title" style={styles.cardHeading}>
            {item.type}
          </ThemedText>
          <ThemedText type="body" style={styles.cardSubheading}>
            {item.title}
          </ThemedText>
          {/* Card Body: Character image */}
          <View style={styles.cardBody}>
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
          {/* Card Footer: Character description */}
          <ThemedText type="body" style={styles.cardDescription}>
            {item.description}
          </ThemedText>
        </ThemedView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/background/onboarding.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView
        style={[
          styles.header,
          {
            backgroundColor: "transparent",
            marginBottom: Spacing.md,
            paddingBottom: 0,
          },
        ]}
      >
        <ThemedText type="title">Choose Your Character</ThemedText>
      </ThemedView>

      <View style={styles.nameInputContainer}>
        <ThemedText type="body">Name Your Character</ThemedText>
        <TextInput
          style={styles.textInput}
          value={inputName}
          onChangeText={(text) => {
            const filtered = text.replace(/[^a-zA-Z0-9\s]/g, "");
            setInputName(filtered);
          }}
          placeholder="Enter character name"
          placeholderTextColor={Colors.cream}
        />
      </View>

      <Animated.View
        style={[styles.characterScrollContainer, animatedScrollStyle]}
      >
        <View
          style={{ marginHorizontal: Spacing.xl, marginBottom: Spacing.md }}
        >
          <ThemedText type="body">Next, choose a character type.</ThemedText>
        </View>
        <FlatList
          data={CHARACTERS}
          horizontal
          snapToInterval={snapInterval}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: (screenWidth - cardWidth) / 2,
          }}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(offsetX / snapInterval);
            setSelectedCharacter(CHARACTERS[newIndex].id);
          }}
          renderItem={({ item, index }) => <Card item={item} index={index} />}
        />
      </Animated.View>

      {/* Animated Continue Button */}
      <Animated.View style={animatedButtonStyle}>
        <ThemedView style={[styles.footer, { backgroundColor: "transparent" }]}>
          <Pressable
            style={[
              styles.continueButton,
              (!selectedCharacter || !debouncedName.trim()) &&
                styles.continueButtonDisabled,
            ]}
            disabled={!selectedCharacter || !debouncedName.trim()}
            onPress={handleContinue}
          >
            <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
              Continue
            </ThemedText>
          </Pressable>
        </ThemedView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
  },
  characterScrollContainer: {
    marginBottom: Spacing.md,
  },
  characterCardContainer: {
    width: cardWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: cardWidth,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: Colors.background.dark,
    padding: Spacing.md,
    alignItems: "center",
  },
  selectedCard: {
    transform: [{ scale: 1 }],
    borderWidth: 2,
    borderColor: Colors.cream,
    opacity: 1,
  },
  inactiveCard: {
    transform: [{ scale: 0.9 }],
    opacity: 0.6,
  },
  cardHeading: {
    fontSize: FontSizes.lg,
    color: Colors.cream,
    marginBottom: Spacing.sm,
  },
  cardSubheading: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    marginBottom: Spacing.sm,
  },
  cardBody: {
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  cardImage: {
    width: cardWidth,
    height: 200,
    borderRadius: BorderRadius.md,
  },
  cardDescription: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  footer: {
    padding: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.button.disabled,
    opacity: 0.5,
  },
  nameInputContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  textInput: {
    height: 40,
    borderColor: Colors.stone,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    color: Colors.text.light,
    marginTop: Spacing.sm,
  },
});
