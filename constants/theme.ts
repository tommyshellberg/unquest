export const Colors = {
  // Base colors from the palette
  cream: "#FAF0D9",
  sand: "#F2D596",
  sage: "#92B3BF",
  forest: "#6B8987",
  mist: "#B0CACD",
  stone: "#A79778",

  // Semantic colors (using our palette)
  primary: "#6B8987", // forest - main brand color
  secondary: "#92B3BF", // sage - secondary actions
  background: {
    light: "#FAF0D9", // cream - light mode background
    dark: "#2C3E50", // darker variant for dark mode
  },
  text: {
    light: "#2C3E50", // dark text for light mode
    dark: "#FAF0D9", // cream text for dark mode
  },
  button: {
    primary: "#6B8987", // forest
    secondary: "#92B3BF", // sage
    disabled: "#B0CACD", // mist
  },
  overlay: {
    light: "rgba(250, 240, 217, 0.8)", // cream with opacity
    dark: "rgba(44, 62, 80, 0.8)", // dark with opacity
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  pill: 9999,
};

export const Typography = {
  body: {
    fontFamily: "inter-regular",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  bodyItalic: {
    fontFamily: "inter-regular",
    fontStyle: "italic",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  bodyMedium: {
    fontFamily: "inter-medium",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  bodySemibold: {
    fontFamily: "inter-semibold",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  bodyBold: {
    fontFamily: "inter-bold",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  bodyBoldItalic: {
    fontFamily: "inter-bold",
    fontStyle: "italic",
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: "cinzel-regular",
    fontSize: FontSizes.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: "cinzel-bold",
    fontSize: FontSizes.xl,
    marginBottom: Spacing.md,
  },
  titleBlack: {
    fontFamily: "cinzel-black",
    fontSize: FontSizes.xl,
    marginBottom: Spacing.md,
  },
} as const;

export default {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Typography,
};
