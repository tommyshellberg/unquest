import { Stack } from "expo-router";

export default function Layout() {
  return (
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
    </Stack>
  );
}
