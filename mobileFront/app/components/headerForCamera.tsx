import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const HeaderForCamera = ({
  callBackToNavigate,
}: {
  callBackToNavigate: () => void;
}) => {
  return (
    <View className="flex-row items-center justify-between bg-black/70 px-4 py-8">
      <TouchableOpacity onPress={callBackToNavigate}>
        <Text className="text-base font-medium text-white">X back</Text>
      </TouchableOpacity>
      <Text className="text-lg font-bold text-white">Preview</Text>
    </View>
  );
};
