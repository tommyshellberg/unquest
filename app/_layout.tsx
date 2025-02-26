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

    // Handle initial navigation or when segments change
    if (!currentSegment) {
      // Only at the root route
      if (!hasCompletedOnboarding) {
        console.log("redirecting to onboarding");
        router.replace("/onboarding");
      } else {
        console.log("redirecting to home");
        router.replace("/(app)/home");
      }
    } else if (!hasCompletedOnboarding && currentSegment !== "onboarding") {
      // Force onboarding if not completed and trying to access other screens
      router.replace("/onboarding");
    }
    // Add this to prevent unwanted redirects after initial navigation
    // This ensures we only redirect on initial load or segment changes
  }, [segments, fontsLoaded, mounted, character, account]);

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
