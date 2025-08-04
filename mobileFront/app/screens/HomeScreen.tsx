import React from "react";
import { View, Text } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type GestureHandlerEvent = PanGestureHandlerGestureEvent;

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleGesture = (event: GestureHandlerEvent) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 50) {
      navigation.navigate("CreateMemory");
    }
  };

  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <Text className={`text-xl font-semibold ${textColor}`}>
          Home Screen
        </Text>
      </View>
    </PanGestureHandler>
  );
};
