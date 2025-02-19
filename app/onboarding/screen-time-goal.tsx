import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Platform, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { useRouter } from "expo-router";
import { useAccountStore } from "@/store/account-store";
import { useNavigation } from "@react-navigation/native";
import { buttonStyles } from "@/styles/buttons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

// Generate time options in 15-minute increments (0h to 12h)
const TIME_OPTIONS = Array.from({ length: 49 }, (_, i) => {
  const hours = Math.floor((i * 15) / 60);
  const minutes = (i * 15) % 60;
  return {
    label: `${hours}h ${minutes ? minutes + "m" : ""}`,
    value: i * 15,
  };
});

export default function ScreenTimeGoalScreen() {
  const router = useRouter();
  const createAccount = useAccountStore((state) => state.createAccount);
  const [currentTime, setCurrentTime] = useState(240); // 4h default
  const [targetTime, setTargetTime] = useState(120); // 2h default

  // Create shared values for animations
  const headerAnim = useSharedValue(0);
  const dropdownAnim = useSharedValue(0);
  const buttonAnim = useSharedValue(0);

  // Animate components in sequence on mount
  useEffect(() => {
    headerAnim.value = withTiming(1, { duration: 500 });
    dropdownAnim.value = withDelay(600, withTiming(1, { duration: 500 }));
    buttonAnim.value = withDelay(1200, withTiming(1, { duration: 500 }));
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerAnim.value,
      transform: [{ translateY: 20 * (1 - headerAnim.value) }],
    };
  });

  const dropdownAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: dropdownAnim.value,
      transform: [{ translateY: 20 * (1 - dropdownAnim.value) }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonAnim.value,
      transform: [{ translateY: 20 * (1 - buttonAnim.value) }],
    };
  });

  const handleContinue = () => {
    // Save screen time goals to account store
    createAccount(currentTime, targetTime);

    router.push("/onboarding/first-quest");
  };

  const navigation = useNavigation();

  // Hide header and drawer for onboarding flow
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false, // Disable swipe gesture for drawer
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/background/onboarding.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView style={[styles.content, { backgroundColor: "transparent" }]}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <ThemedText type="title">Set Your Goals</ThemedText>
          <ThemedText type="body">
            The journey to better habits starts with acknowledging where we are.
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.pickerSection, dropdownAnimatedStyle]}>
          <ThemedText
            type="bodyBold"
            style={{ ...Typography.bodyBold, color: Colors.text.light }}
          >
            What's your current daily screen time?
          </ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentTime}
              onValueChange={setCurrentTime}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {TIME_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={Colors.forest}
                />
              ))}
            </Picker>
          </View>

          <ThemedText
            type="bodyBold"
            style={{
              ...Typography.bodyBold,
              color: Colors.text.light,
              fontSize: FontSizes.md,
            }}
          >
            What's your daily screen time goal?
          </ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={targetTime}
              onValueChange={setTargetTime}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {TIME_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={Colors.forest}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View style={[styles.footer, buttonAnimatedStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
          >
            <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
              Set My Goal
            </ThemedText>
          </Pressable>
        </Animated.View>
      </ThemedView>
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
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  header: {
    gap: Spacing.sm,
    marginTop: "10%",
  },
  pickerSection: {
    flex: 1,
    gap: Spacing.lg,
    marginTop: "5%",
  },
  pickerContainer: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        height: 150,
      },
      android: {
        height: 50,
      },
    }),
  },
  picker: {
    width: "100%",
    ...Platform.select({
      android: {
        color: Colors.text.light,
      },
    }),
  },
  pickerItem: {
    fontSize: FontSizes.lg,
    height: 150,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
  },
  continueButtonPressed: {
    backgroundColor: Colors.secondary,
  },
});
