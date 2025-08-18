import React from "react";
import { Pressable } from "react-native";
import { ThemedText } from "./ThemedText";

interface Props {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
}
