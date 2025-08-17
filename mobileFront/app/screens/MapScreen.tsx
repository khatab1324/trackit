import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import MapView from "react-native-maps";
import { MapComponent } from "../components/MapComponent";
import type { Memory } from "../core/types/memory";

export const MapScreen = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleMemorySelect = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleCloseMemory = () => {
    setSelectedMemory(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapComponent 
        selectedMemory={selectedMemory}
        onMemorySelect={handleMemorySelect}
        onCloseMemory={handleCloseMemory}
      />
    </View>
  );
};