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
import {
  useGetCurrentUserMemoriesQuery,
  useGetNearMemoryQuery,
} from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";

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
  const { data } = useGetNearMemoryQuery({
    location: {
      lang: 31.994482,
      long: 35.95843,
    },
  });

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View className={`flex-1 justify-center items-center`}>
        {data ? <MemoListComp data={data} /> : <Text>Loading...</Text>}
      </View>
    </PanGestureHandler>
  );
};
