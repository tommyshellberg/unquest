import { Text, TextProps, StyleSheet } from "react-native";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { forwardRef } from "react";

type ThemedTextProps = TextProps & {
  type?:
    | "body"
    | "bodyItalic"
    | "bodyMedium"
    | "bodySemibold"
    | "bodyBold"
    | "bodyBoldItalic"
    | "bodyLight"
    | "subtitle"
    | "title";
};

export const ThemedText = forwardRef<Text, ThemedTextProps>((props, ref) => {
  const { type = "body", style } = props;
  return <Text ref={ref} style={[styles[type], style]} {...props} />;
});

const styles = StyleSheet.create({
  body: {
    ...Typography.body,
    color: Colors.primary,
  },
  bodyItalic: {
    ...Typography.bodyItalic,
    color: Colors.primary,
  },
  bodyMedium: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
  bodySemibold: {
    ...Typography.bodySemibold,
    color: Colors.primary,
  },
  bodyBold: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  bodyBoldItalic: {
    ...Typography.bodyBoldItalic,
    color: Colors.primary,
  },
  title: {
    ...Typography.title,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.text.light,
  },
  bodyLight: {
    ...Typography.body,
    color: Colors.text.dark,
  },
});
