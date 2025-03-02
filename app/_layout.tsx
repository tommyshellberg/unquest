import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import { useFonts } from "expo-font";
import { fonts } from "@/constants/fonts";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { removeTokens } from "@/services/auth";

export const TAB_BAR_HEIGHT = 100;

// Prevent the splash screen from auto-hiding until the fonts are loaded
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn, isLoading } = useAuth();
  const [fontsLoaded] = useFonts(fonts);

  // Add a ref to prevent multiple redirection calls
  const redirectCalled = useRef(false);

  useEffect(() => {
    if (!fontsLoaded || isLoading || redirectCalled.current) return;

    // Determine the current top-level segment
    // If already within 'onboarding' or '(app)', do nothing
    const currentSegment = segments[0] || "";
    if (currentSegment === "onboarding" || currentSegment === "(app)") {
      return;
    }

    if (isLoggedIn) {
      console.log("User is logged in, redirecting to home");
      redirectCalled.current = true;
      router.replace("/(app)/home");
    } else {
      console.log("User is not logged in, redirecting to onboarding");
      redirectCalled.current = true;
      router.replace("/onboarding");
    }
  }, [fontsLoaded, isLoading, isLoggedIn, segments, router]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
