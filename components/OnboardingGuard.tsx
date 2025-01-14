import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const character = useCharacterStore((state) => state.character);
  const account = useAccountStore((state) => state.account);

  useEffect(() => {
    const inOnboarding = segments[0] === "onboarding";
    const hasCompletedOnboarding = character && account;

    if (!hasCompletedOnboarding && !inOnboarding) {
      // No saved data and not in onboarding - redirect to onboarding
      router.replace("/onboarding");
    } else if (hasCompletedOnboarding && inOnboarding) {
      // Has saved data but in onboarding - redirect to home
      router.replace("/home");
    }
  }, [character, account, segments]);

  return <>{children}</>;
}
