import {
  Image,
  StyleSheet,
  Pressable,
  View,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { CHARACTERS } from "../../constants/characters";
import { useRouter } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { CharacterType } from "@/store/types";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { buttonStyles } from "@/styles/buttons";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

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

  const handleContinue = () => {
    if (!selectedCharacter) return;
    // Get character details from CHARACTERS constant
    const character = CHARACTERS.find((c) => c.id === selectedCharacter);
    if (!character) return;
    // Create character in store
    createCharacter(character.id as CharacterType, character.name);
    router.push("/onboarding/screen-time-goal");
  };

  // Hide header and drawer for onboarding flow
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false, // Disable swipe gesture for drawer
    });
  }, []);

  // Shared value for scroll animation
  const scrollX = useSharedValue(0);

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
          {/* Card Header: Character name */}
          <ThemedText type="title" style={styles.cardHeading}>
            {item.name}
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
      <View style={styles.scrollView}>
        <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
          <ThemedText type="title">Your Character</ThemedText>
          <ThemedText type="body">
            Choose the character you feel best represents the best version of
            yourself.
          </ThemedText>
          <ThemedText type="body">
            Each embodies different virtues that grow stronger as you spend time
            away.
          </ThemedText>
        </ThemedView>

        <View style={styles.characterScrollContainer}>
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
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(offsetX / snapInterval);
              setSelectedCharacter(CHARACTERS[newIndex].id);
            }}
            renderItem={({ item, index }) => <Card item={item} index={index} />}
          />
        </View>

        <ThemedView style={[styles.footer, { backgroundColor: "transparent" }]}>
          <Pressable
            style={[
              styles.continueButton,
              !selectedCharacter && styles.continueButtonDisabled,
            ]}
            disabled={!selectedCharacter}
            onPress={handleContinue}
          >
            <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
              Continue
            </ThemedText>
          </Pressable>
        </ThemedView>
      </View>
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
    marginBottom: Spacing.xl,
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
    borderColor: Colors.cream, // adjust to your preferred light border color
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
    width: cardWidth, // use cardWidth to match the container
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
});
