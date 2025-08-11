import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FlashMode = "off" | "on" | "auto";

type Props = {
  flash: FlashMode;
  onToggleFlash: () => void;
  onFlipCamera: () => void;
};

export default function CameraSideToolbar({
  flash,
  onToggleFlash,
  onFlipCamera,
}: Props) {
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = 56;
  const GAP = 12;
  const top = insets.top + HEADER_HEIGHT + GAP;

  return (
    <View
      className="items-center"
      style={{ position: "absolute", right: 20, top }}
    >
      <TouchableOpacity
        className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-black/50"
        onPress={onToggleFlash}
        activeOpacity={0.8}
      >
        {flash === "off" && <Ionicons name="flash-off" size={22} color="#fff" />}
        {flash === "on" && <Ionicons name="flash" size={22} color="#fff" />}
        {flash === "auto" && <Ionicons name="flash-outline" size={22} color="#fff" />}
      </TouchableOpacity>

      <TouchableOpacity
        className="h-12 w-12 items-center justify-center rounded-full bg-black/50"
        onPress={onFlipCamera}
        activeOpacity={0.8}
      >
        <Ionicons name="camera-reverse" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
