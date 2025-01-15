import { Stack } from "expo-router";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { ProfileBadge } from "@/components/ProfileBadge";

export default function RootLayout() {
  return (
    <OnboardingGuard>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerRight: () => <ProfileBadge />,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            presentation: "modal",
            title: "Character Progress",
          }}
        />
      </Stack>
    </OnboardingGuard>
  );
}
