import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { FilterKey } from "./CameraFilterOverlay";

type Props = {
  label: string;
  value: FilterKey;
  active?: boolean;
  onPress?: () => void;
};

export default function FilterChip({ label, value, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`items-center ${active ? "" : "opacity-80"}`}
      activeOpacity={0.8}
    >
      <View
        className={`h-12 w-12 rounded-full overflow-hidden border ${
          active ? "border-white" : "border-white/60"
        }`}
      >
        {value === "warm" && <View className="flex-1 bg-orange-300/60" />}
        {value === "cool" && <View className="flex-1 bg-blue-300/60" />}
        {value === "sepia" && <View className="flex-1 bg-amber-700/60" />}
        {value === "rose" && (
          <LinearGradient colors={["#ff0066aa", "#ffffff00"]} style={{ flex: 1 }} />
        )}
        {value === "dramatic" && (
          <LinearGradient colors={["#00000066", "#00000033"]} style={{ flex: 1 }} />
        )}
        {value === "none" && <View className="flex-1 bg-white/10" />}
      </View>
      <Text className={`mt-1 text-xs ${active ? "text-white" : "text-white/80"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
