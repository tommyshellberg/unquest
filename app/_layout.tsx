import { Stack } from "expo-router";
import { OnboardingGuard } from "@/components/OnboardingGuard";

export default function RootLayout() {
  return (
    <OnboardingGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="onboarding/choose-character"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="onboarding/screen-time-goal"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="onboarding/first-quest"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </Stack>
    </OnboardingGuard>
  );
}
