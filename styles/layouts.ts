import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

export const layoutStyles = StyleSheet.create({
  // Common full-screen container
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  // Background image container pattern
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  // Common overlays
  lightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.light,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.dark,
  },
  // Common scroll container
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Common centered content
  centeredContent: {
    flex: 1,
    alignItems: "center",
  },
});
