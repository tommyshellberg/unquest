import { useState } from "react";
import { StyleSheet, View, Image, Platform, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/store/onboarding-store";

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
  const { setScreenTimes } = useOnboardingStore();
  const [currentTime, setCurrentTime] = useState(240); // Default 4h
  const [targetTime, setTargetTime] = useState(120); // Default 2h

  const handleContinue = () => {
    setScreenTimes(currentTime, targetTime);
    router.push("/onboarding/first-quest");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/onboarding-bg-3.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView style={[styles.content, { backgroundColor: "transparent" }]}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Set Your Goals
          </ThemedText>
          <ThemedText style={styles.description}>
            The journey to better habits starts with acknowledging where we are.
          </ThemedText>
        </View>

        <View style={styles.pickerSection}>
          <ThemedText style={styles.pickerLabel}>
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

          <ThemedText style={[styles.pickerLabel, styles.secondPickerLabel]}>
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
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
          >
            <ThemedText style={styles.continueButtonText}>
              Set My Goal
            </ThemedText>
          </Pressable>
        </View>
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
    gap: Spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes.xxl,
    color: Colors.forest,
    textAlign: "center",
    fontWeight: "600",
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    textAlign: "center",
    lineHeight: 24,
  },
  pickerSection: {
    flex: 1,
    gap: Spacing.xl,
    justifyContent: "center",
  },
  pickerLabel: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    textAlign: "center",
    fontWeight: "500",
  },
  secondPickerLabel: {},
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
        color: Colors.forest,
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
  continueButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
});
