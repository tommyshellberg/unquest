import { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
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
import { Colors, Spacing, FontSizes } from "@/constants/theme";

type DrawerItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: "home" | "profile";
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
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons name={item.icon} size={24} color={Colors.forest} />
            <ThemedText style={styles.drawerItemText}>{item.label}</ThemedText>
          </Pressable>
        ))}
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
    borderRadius: 8,
  },
  drawerItemPressed: {
    backgroundColor: Colors.mist,
  },
  drawerItemText: {
    marginLeft: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.forest,
  },
});
