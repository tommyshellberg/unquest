import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import { useFonts } from "expo-font";
import { fonts } from "@/constants/fonts";
import * as SplashScreen from "expo-splash-screen";

export const TAB_BAR_HEIGHT = 100;

// Prevent the splash screen from auto-hiding until the fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // A flag that confirms the component has been mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const segments = useSegments();
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    // We don't proceed until fonts are loaded and the component is mounted.
    if (!fontsLoaded || !mounted) {
      return;
    }

    const hasCompletedOnboarding = character && account;
    const currentSegment = segments[0] || "";

    if (!hasCompletedOnboarding && currentSegment !== "onboarding") {
      router.replace("/onboarding");
    } else if (hasCompletedOnboarding) {
      router.replace("/(app)/home");
    }
  }, [character, account, segments, fontsLoaded, mounted]);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render the app until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return <Slot />;
}
