import React, { useRef, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { setLocation } from "../store/slices/sheardDataSlice";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { runOnJS } from "react-native-reanimated";

import { MainStackParamList } from "../../App";
import { RootState } from "../store";
import { useGetNearMemoryQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const dispatch = useDispatch();
  const jwt = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.user);
  const coords = useSelector((s: RootState) => s.sheardDataThrowApp.location);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (coords) return;
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location", "Permission to access location was denied");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!mounted) return;
        const lang = pos.coords.latitude;
        const long = pos.coords.longitude;
        dispatch(setLocation({ lang, long }));
      } catch (e) {
        console.warn("Location error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [coords, dispatch]);

  const { data, isLoading, isError } = useGetNearMemoryQuery(
    coords ? { location: coords } : (skipToken as any)
  );

  useEffect(() => {
    console.log("JWT:", jwt);
    console.log("user:", user);
    console.log("memories:", data?.length ?? 0);
  }, [user, jwt, data]);

  const pan = Gesture.Pan()
    .activeOffsetY([-40, 40])
    .activeOffsetX(20)
    .onUpdate((e) => {
      if (e.translationX > 80) {
        runOnJS(navigation.navigate)({
          name: "CreateMemory",
          params: undefined,
        });
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View className="flex-1 bg-black">
        {isLoading && <Text className="text-white">Loading...</Text>}
        {isError && <Text className="text-white">Failed to load.</Text>}
        {data && <MemoListComp data={data} />}
        {!coords && !isLoading && !isError && (
          <Text className="text-white px-4 mt-4">
            Waiting for location permission...
          </Text>
        )}
      </View>
    </GestureDetector>
  );
};
