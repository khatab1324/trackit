import React, { useEffect } from "react";
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
  const jwt = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    console.log("JWT:", jwt);
    console.log("user:", user);
    console.log();
  }, [user]);
  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home Screen</Text>
      </View>
    </PanGestureHandler>
  );
};
