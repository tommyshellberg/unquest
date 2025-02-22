import {
  CinzelDecorative_400Regular,
  CinzelDecorative_700Bold,
  CinzelDecorative_900Black,
} from "@expo-google-fonts/cinzel-decorative";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import {
  IMFellDWPica_400Regular,
  IMFellDWPica_400Regular_Italic,
} from "@expo-google-fonts/im-fell-dw-pica";

export const fonts = {
  "cinzel-regular": CinzelDecorative_400Regular,
  "cinzel-bold": CinzelDecorative_700Bold,
  "cinzel-black": CinzelDecorative_900Black,
  "inter-regular": Inter_400Regular,
  "inter-medium": Inter_500Medium,
  "inter-semibold": Inter_600SemiBold,
  "inter-bold": Inter_700Bold,
  "imfell-pica": IMFellDWPica_400Regular,
  "imfell-pica-italic": IMFellDWPica_400Regular_Italic,
};

export type FontFamily = keyof typeof fonts;
