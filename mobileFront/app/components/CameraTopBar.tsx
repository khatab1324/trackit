import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onBack?: () => void;
  title?: string;
  className?: string;
};

export default function CameraTopBar({
  onBack,
  title = "Preview",
  className,
}: Props) {
  return (
    <SafeAreaView
      edges={["top"]}
      className={`bg-black/70 pb-2 ${className ?? ""}`}  
    >
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity
          onPress={onBack}
          className="flex-row items-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-medium text-white">X back</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white ml-auto pr-6">
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}
