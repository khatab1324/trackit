import React from "react";
import { Text, TextProps } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

type Variant = "default" | "muted" | "error" | "inverse";

interface Props extends TextProps {
  variant?: Variant;
  children: React.ReactNode;
}

export default function ThemedText({ variant = "default", style, children, ...rest }: Props) {
  const c = useThemeColors();

  const color =
    variant === "muted" ? c.placeholder :
    variant === "error" ? c.error :
    variant === "inverse" ? c.background :
    c.text;

  return (
    <Text {...rest} style={[{ color }, style]}>
      {children}
    </Text>
  );
}
