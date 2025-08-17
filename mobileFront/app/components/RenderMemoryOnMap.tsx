import React, { Fragment, useEffect } from "react";
import { Marker } from "react-native-maps";
import {
  useGetMemoriesQuery,
  useGetMemoryByIdMutation,
} from "../lib/APIs/RTKQuery/memoryApi";
import { TouchableOpacity, View } from "react-native";
import type { Memory } from "../core/types/memory";

type Props = {
  onMemorySelect: (memory: Memory) => void;
};

export const RenderMemoryOnMap: React.FC<Props> = ({ onMemorySelect }) => {
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
      // Call the onMemorySelect callback with the fetched memory
      onMemorySelect(memory);
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
