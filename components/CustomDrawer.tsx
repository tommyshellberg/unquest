import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ProfileInfo } from "./ProfileInfo";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { usePOIStore } from "@/store/poi-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DrawerItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: "home" | "profile" | "map";
};

const DRAWER_ITEMS: DrawerItem[] = [
  {
    label: "Home",
    icon: "home-outline",
    route: "home",
  },
  {
    label: "Character",
    icon: "person-outline",
    route: "profile",
  },
  {
    label: "Map",
    icon: "map-outline",
    route: "map",
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CustomDrawer({ isOpen, onClose }: Props) {
  const router = useRouter();
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease,
      });
    }
  }, [isOpen]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleNavigation = (route: DrawerItem["route"]) => {
    router.push(route);
    onClose();
  };

  const resetAppData = () => {
    Alert.alert(
      "Reset App Data",
      "Are you sure you want to reset the app data? This will delete all your progress.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: handleReset },
      ]
    );
  };

  const handleReset = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Reset Zustand stores
      useQuestStore.getState().reset();
      usePOIStore.getState().reset();

      // Reset any other stores here

      Alert.alert("App Data Reset", "The app data has been reset.");
    } catch (error) {
      console.error("Failed to reset app data:", error);
      Alert.alert("Error", "Failed to reset app data. Please try again.");
    }
  };

  return (
    <View style={[styles.container, !isOpen && styles.hidden]}>
      <Animated.View
        style={[styles.overlay, overlayAnimatedStyle]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Pressable style={styles.overlayPressable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <ProfileInfo size="large" />
        <View style={styles.divider} />
        {DRAWER_ITEMS.map((item) => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [
              styles.drawerItem,
              pressed && styles.drawerItemPressed,
            ]}
            onPressOut={() => handleNavigation(item.route)}
          >
            <Ionicons name={item.icon} size={24} color={Colors.primary} />
            <ThemedText
              type="subtitle"
              style={{
                marginLeft: Spacing.sm,
                ...Typography.subtitle,
                color: Colors.primary,
              }}
            >
              {item.label}
            </ThemedText>
          </Pressable>
        ))}
        {__DEV__ && (
          <Pressable onPress={resetAppData} style={styles.resetButton}>
            <ThemedText style={styles.resetButtonText} type="bodyBold">
              Reset App Data
            </ThemedText>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  hidden: {
    pointerEvents: "none",
  },
  drawer: {
    width: "70%",
    backgroundColor: Colors.background.light,
    height: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.mist,
    marginVertical: Spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayPressable: {
    width: "100%",
    height: "100%",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  drawerItemPressed: {
    backgroundColor: Colors.mist,
  },
  resetButton: {
    padding: 16,
  },
  resetButtonText: {
    color: "red",
  },
});
