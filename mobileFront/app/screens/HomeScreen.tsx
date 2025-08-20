import React, { useEffect, useRef } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
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
import clsx from "clsx";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();
  const jwt = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.user);
  const coords = useSelector((s: RootState) => s.sheardDataThrowApp.location);
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const watchingRef = useRef<{ remove: () => void } | null>(null);

useEffect(() => {
    let cancelled = false;

    (async () => {
      if (coords) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location", "Permission to access location was denied");
        return;
      }

      const last = await Location.getLastKnownPositionAsync();
      if (last && !cancelled) {
        dispatch(setLocation({ lang: last.coords.latitude, long: last.coords.longitude }));
      }

      try {
        const quick = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low, 
        });
        if (!cancelled) {
          dispatch(setLocation({ lang: quick.coords.latitude, long: quick.coords.longitude }));
        }
      } catch (e) {
        console.warn("Quick fix failed:", e);
      }

      try {
        watchingRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced, 
            timeInterval: 2000,                   
            distanceInterval: 5,                  
            mayShowUserSettingsDialog: true,      
          },
          (update) => {
            if (cancelled) return;
            dispatch(setLocation({ lang: update.coords.latitude, long: update.coords.longitude }));
          }
        );

        // Stop the watch after 10 seconds; we already have something usable.
        setTimeout(() => {
          if (watchingRef.current) {
            watchingRef.current.remove();
            watchingRef.current = null;
          }
        }, 10000);
      } catch (e) {
        console.warn("Watch failed:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (watchingRef.current) {
        watchingRef.current.remove();
        watchingRef.current = null;
      }
    };
  }, [coords, dispatch]);


  const { data, isLoading, isError, isFetching, refetch } = useGetNearMemoryQuery(
    coords ? { location: coords } : (skipToken as any)
  );

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

  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className={clsx(
        "w-24 h-24 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
      <Text className={clsx(
        "text-lg font-medium",
        isDark ? "text-gray-300" : "text-gray-600"
      )}>
        Loading memories...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className={clsx(
        "w-24 h-24 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <Ionicons 
          name="alert-circle-outline" 
          size={48} 
          color={isDark ? "#F87171" : "#DC2626"} 
        />
      </View>
      <Text className={clsx(
        "text-xl font-semibold mb-2",
        isDark ? "text-white" : "text-black"
      )}>
        Failed to load memories
      </Text>
      <Text className={clsx(
        "text-base text-center px-8",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Pull down to refresh and try again
      </Text>
    </View>
  );

  const renderLocationWaiting = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className={clsx(
        "w-24 h-24 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <Ionicons 
          name="location-outline" 
          size={48} 
          color="#3B82F6" 
        />
      </View>
      <Text className={clsx(
        "text-xl font-semibold mb-2",
        isDark ? "text-white" : "text-black"
      )}>
        Location Access Required
      </Text>
      <Text className={clsx(
        "text-base text-center px-8",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Please enable location access to see nearby memories
      </Text>
    </View>
  );

  const renderNoMemories = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className={clsx(
        "w-24 h-24 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <Ionicons 
          name="images-outline" 
          size={48} 
          color="#3B82F6" 
        />
      </View>
      <Text className={clsx(
        "text-xl font-semibold mb-2",
        isDark ? "text-white" : "text-black"
      )}>
        No Memories Nearby
      </Text>
      <Text className={clsx(
        "text-base text-center px-8",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        There are no memories in your area yet. Be the first to create one!
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (isError) return renderErrorState();
    if (!coords) return renderLocationWaiting();
    if (data && data.length > 0) {
      return (
        <View className="flex-1">
          <MemoListComp data={data} refetch={refetch} isFetching={isFetching} />
        </View>
      );
    }
    if (data && data.length === 0) {
      return renderNoMemories();
    }
    return null;
  };

  return (
    <GestureDetector gesture={pan}>
      <View className={clsx(
        "flex-1",
        isDark ? "bg-black" : "bg-white"
      )}>
        {renderContent()}
      </View>
    </GestureDetector>
  );
};
