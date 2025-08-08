import React, { Fragment, useEffect } from "react";
import { Marker } from "react-native-maps";
import {
  useGetMemoriesQuery,
  useGetMemoryByIdMutation,
} from "../lib/APIs/RTKQuery/memoryApi";
import { View } from "react-native";

export const RenderMemoryOnMap = () => {
  const { data = [], isLoading, isSuccess } = useGetMemoriesQuery();
  const [getMemoryById] = useGetMemoryByIdMutation();

  if (isLoading) {
    console.log("Still loading memories...");
    return null;
  }

  if (!isSuccess || data.length === 0) {
    console.log("No memories to display");
    return null;
  }
  const onPressMemory = async (memoryId: string) => {
    try {
      const memory = await getMemoryById(memoryId).unwrap();
      console.log("Memory details:", memory);
    } catch (error) {
      console.error("Failed to fetch memory by ID:", error);
    }
  };

  return (
    <View>
      {data.map((m) => (
        <Marker
          key={`memory-${m.id}`}
          coordinate={{ latitude: m.lang, longitude: m.long }}
          title={"Memory"}
          description={m.description ?? "No description"}
          pinColor="red"
          onPress={() => onPressMemory(m.id)}
        />
      ))}
    </View>
  );
};
