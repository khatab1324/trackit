import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import MapView from "react-native-maps";
import { SearchComponent } from "../components/SearchComponent";
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
      {/* Only show search when no memory is selected */}
      {!selectedMemory && (
        <View style={{ position: 'absolute', top: 48, left: 16, right: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 12, elevation: 4 }}>
            <SearchComponent />
          </View>
        </View>
      )}
    </View>
  );
};