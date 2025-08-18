import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";

export const HeaderForCamera = ({
  callBackToNavigate,
}: {
  callBackToNavigate: () => void;
}) => {
  const themeColors = useThemeColors();
  return (
    <View className="flex-row items-center justify-between bg-black/70 px-4 py-8">
      <TouchableOpacity onPress={callBackToNavigate}>
        <ThemedText className="text-base font-medium">X back</ThemedText>
      </TouchableOpacity>
      <ThemedText className="text-lg font-bold">Preview</ThemedText>
    </View>
  );
};
