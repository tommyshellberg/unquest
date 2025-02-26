import { MD3LightTheme } from "react-native-paper";
import { Colors, Typography, BorderRadius } from "./theme";

const customTheme = {
  ...MD3LightTheme,
  roundness: BorderRadius.lg,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    accent: Colors.secondary,
    background: Colors.background.light,
    surface: Colors.cream,
    text: Colors.text.light,
    // You can override other colors as needed.
  },
  // MD3 uses a more detailed typography system.
  fonts: {
    displayLarge: {
      fontFamily: Typography.title.fontFamily,
      fontSize: Typography.title.fontSize,
    },
    displayMedium: {
      fontFamily: Typography.title.fontFamily,
      fontSize: Typography.title.fontSize,
    },
    displaySmall: {
      fontFamily: Typography.title.fontFamily,
      fontSize: Typography.title.fontSize,
    },
    headlineLarge: {
      fontFamily: Typography.subtitle.fontFamily,
      fontSize: Typography.subtitle.fontSize,
    },
    headlineMedium: {
      fontFamily: Typography.subtitle.fontFamily,
      fontSize: Typography.subtitle.fontSize,
    },
    headlineSmall: {
      fontFamily: Typography.bodyMedium.fontFamily,
      fontSize: Typography.bodyMedium.fontSize,
    },
    titleLarge: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
    titleMedium: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
    titleSmall: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
    bodyLarge: {
      fontFamily: Typography.body.fontFamily,
      fontSize: Typography.body.fontSize,
    },
    bodyMedium: {
      fontFamily: Typography.body.fontFamily,
      fontSize: Typography.body.fontSize,
    },
    bodySmall: {
      fontFamily: Typography.body.fontFamily,
      fontSize: Typography.body.fontSize,
    },
    labelLarge: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
    labelMedium: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
    labelSmall: {
      fontFamily: Typography.bodyBold.fontFamily,
      fontSize: Typography.bodyBold.fontSize,
    },
  },
  isV3: true,
};

export default customTheme;
