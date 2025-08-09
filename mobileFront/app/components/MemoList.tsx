import React, { useEffect } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import type { Memory } from "../core/types/memory";
import { MemoComponent } from "./MemoComponent";
import { FlashList } from "@shopify/flash-list";
export const MemoListComp = ({ data }: { data: Memory[] | undefined }) => {
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("No memories available to display.");
    } else {
      console.log("Displaying memories:", data.length);
    }
  }, [data]);
  return (
    <View className=" bg-black">
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
          />
        )}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};
