import React from "react";
import { View, ViewProps } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function ThemedView({ style, ...rest }: ViewProps) {
  const c = useThemeColors();
  return <View {...rest} style={[{ backgroundColor: c.background }, style]} />;
}
