import React from "react";
import { Text, Pressable } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Text>{title}</Text>
    </Pressable>
  );
}
