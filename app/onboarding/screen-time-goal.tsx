import React, { useEffect, useState } from "react";
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

// Generate time options in 30-minute increments (30m to 12h)
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const value = (i + 1) * 30; // starts at 30 minutes
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return {
    label: `${hours}h${minutes ? ` ${minutes}m` : ""}`,
    value,
  };
});

export default function ScreenTimeGoalScreen() {
  const router = useRouter();
  const createAccount = useAccountStore((state) => state.createAccount);
  const navigation = useNavigation();

  // Use -1 as the "invalid" placeholder value.
  const [currentTime, setCurrentTime] = useState<number>(-1);
  const [targetTime, setTargetTime] = useState<number>(-1);

  // Animation shared values:
  const headerAnim = useSharedValue(0);
  const firstDropdownAnim = useSharedValue(0);
  const secondDropdownAnim = useSharedValue(0);
  const buttonAnim = useSharedValue(0);

  // Animate header and first drop-down on mount:
  useEffect(() => {
    headerAnim.value = withTiming(1, { duration: 500 });
    firstDropdownAnim.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, []);

  // Animate second drop-down when first drop-down has a valid value:
  useEffect(() => {
    if (currentTime >= 30) {
      secondDropdownAnim.value = withTiming(1, { duration: 500 });
    } else {
      secondDropdownAnim.value = 0;
      // Also clear second value if first selection is removed.
      setTargetTime(-1);
    }
  }, [currentTime, secondDropdownAnim]);

  // Animate Continue button only when both values are valid:
  useEffect(() => {
    if (currentTime >= 30 && targetTime >= 30) {
      buttonAnim.value = withTiming(1, { duration: 500 });
    } else {
      buttonAnim.value = 0;
    }
  }, [currentTime, targetTime, buttonAnim]);

  // Animated styles:
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: 20 * (1 - headerAnim.value) }],
  }));

  const firstDropdownAnimatedStyle = useAnimatedStyle(() => ({
    opacity: firstDropdownAnim.value,
    transform: [{ translateY: 20 * (1 - firstDropdownAnim.value) }],
  }));

  const secondDropdownAnimatedStyle = useAnimatedStyle(() => ({
    opacity: secondDropdownAnim.value,
    transform: [{ translateY: 20 * (1 - secondDropdownAnim.value) }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonAnim.value,
    transform: [{ translateY: 20 * (1 - buttonAnim.value) }],
  }));

  const handleContinue = () => {
    // Prevent navigation if either drop-down value is invalid
    if (currentTime < 30 || targetTime < 30) return;
    // Save screen time goals to the account store
    createAccount(currentTime, targetTime);
    router.push("/onboarding/app-introduction");
  };

  // Hide header and drawer for onboarding flow
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/background/onboarding.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView style={[styles.content, { backgroundColor: "transparent" }]}>
        {/* Animate header & description */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <ThemedText type="title">Set Your Goals</ThemedText>
          <ThemedText type="body">
            The journey to better habits starts with acknowledging where we are.
          </ThemedText>
        </Animated.View>

        {/* Animate first drop-down (current daily screen time) */}
        <Animated.View
          style={[styles.pickerSection, firstDropdownAnimatedStyle]}
        >
          <ThemedText
            type="bodyBold"
            style={{ ...Typography.bodyBold, color: Colors.text.light }}
          >
            What's your current daily screen time?
          </ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentTime}
              onValueChange={(itemValue) => setCurrentTime(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item
                label="Select current screen time"
                value={-1}
                color="#ccc"
              />
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

        {/* Conditionally animate and render the second drop-down (target screen time) only when the first is valid */}
        {currentTime >= 30 && (
          <Animated.View
            style={[styles.pickerSection, secondDropdownAnimatedStyle]}
          >
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
                onValueChange={(itemValue) => setTargetTime(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item
                  label="Select target screen time"
                  value={-1}
                  color="#ccc"
                />
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
        )}

        {/* Animate Continue button (disabled if either value is invalid) */}
        <Animated.View style={[styles.footer, buttonAnimatedStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (currentTime < 30 || targetTime < 30) &&
                styles.continueButtonDisabled,
              pressed && styles.continueButtonPressed,
            ]}
            disabled={currentTime < 30 || targetTime < 30}
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
  continueButtonDisabled: {
    backgroundColor: Colors.button.disabled,
    opacity: 0.5,
  },
  continueButtonPressed: {
    opacity: 0.8,
  },
});
