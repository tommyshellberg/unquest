import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";

export const TAB_BAR_HEIGHT = 100;

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);

  useEffect(() => {
    const hasCompletedOnboarding = character && account;
    const currentSegment = segments[0] || "";

    console.log("Current segments:", segments);
    console.log("Current segment:", currentSegment);
    console.log("Has completed onboarding:", hasCompletedOnboarding);

    if (!hasCompletedOnboarding && currentSegment !== "onboarding") {
      console.log("Redirecting to onboarding...");
      router.replace("/onboarding");
    } else if (hasCompletedOnboarding && currentSegment !== "onboarding") {
      console.log("Redirecting to main app...");
      router.replace("/(app)/home");
    }
    // Else, we're on the correct path, no need to redirect
  }, [character, account, segments]);

  return <Slot />;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
    position: "absolute",
    borderTopWidth: 0,
    elevation: 0,
    height: TAB_BAR_HEIGHT,
    bottom: 10,
    left: 20,
    right: 20,
  },
});
