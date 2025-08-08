import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const ChatScreen = () => {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-lg font-semibold ${textColor}`}>Chat screen</Text>
    </View>
  );
};
