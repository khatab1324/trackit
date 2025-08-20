import React, { useEffect } from "react";
import { FlatList, useWindowDimensions, View, Text } from "react-native";
import type { Memory } from "../core/types/memory";
import { MemoComponent } from "./MemoComponent";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import clsx from "clsx";
import { Ionicons } from "@expo/vector-icons";

export const MemoListComp = ({ data, refetch, isFetching }: { data: Memory[] | undefined, refetch: () => void, isFetching: boolean }) => {
  const { height, width } = useWindowDimensions();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("No memories available to display.");
    } else {
      console.log("Displaying memories:", data.length);
    }
  }, [data]);

  // If no data or empty array, show empty state
  if (!data || data.length === 0) {
    return (
      <View className={clsx(
        "flex-1 justify-center items-center px-6",
        isDark ? "bg-black" : "bg-white"
      )}>
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
          No Memories Found
        </Text>
        <Text className={clsx(
          "text-base text-center px-8",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          Pull down to refresh or check back later
        </Text>
      </View>
    );
  }

  return (
    <View className={clsx(
      "flex-1",
      isDark ? "bg-black" : "bg-white"
    )}>
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        renderItem={({ item }) => (
          <MemoComponent
            memory={item}
            screenHeight={height}
            screenWidth={width}
            showBackButton={false}
          />
        )}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onRefresh={refetch}
        refreshing={isFetching}
      />
    </View>
  );
};