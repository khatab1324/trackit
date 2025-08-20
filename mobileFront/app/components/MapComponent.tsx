import React, { useRef, useState } from "react";
import { View, StyleSheet, Platform, Text, TouchableOpacity, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { hp } from "../core/theme/responsiveHandler";
import { RenderMemoryOnMap } from "./RenderMemoryOnMap";
import { MemoComponent } from "./MemoComponent";
import { MapSearchComponent } from "./MapSearchComponent";
import type { Memory } from "../core/types/memory";

type Props = {
  selectedMemory: Memory | null;
  onMemorySelect: (memory: Memory) => void;
  onCloseMemory: () => void;
};

export const MapComponent: React.FC<Props> = ({
  selectedMemory,
  onMemorySelect,
  onCloseMemory,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: 31.98469,
    longitude: 35.918267,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleLocationSelect = (latitude: number, longitude: number, address: string) => {
    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01, 
      longitudeDelta: 0.01,
    };
    
    setCurrentRegion(newRegion);
    
    mapRef.current?.animateToRegion(newRegion, 1000);
  };
  if (selectedMemory) {
    return (
      <View style={styles.memoContainer}>
        <MemoComponent
          memory={selectedMemory}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          showBackButton={false}
        />
        <View style={styles.backButton}>
          <TouchableOpacity
            style={styles.backButtonTouchable}
            onPress={onCloseMemory}
          >
            <Text style={styles.backButtonText}>← Back to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ height: hp(100) }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={currentRegion}
        region={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
      >
        <RenderMemoryOnMap onMemorySelect={onMemorySelect} />
      </MapView>
      
      <View style={styles.searchContainer}>
        <MapSearchComponent onLocationSelect={handleLocationSelect} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  memoContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  backButtonTouchable: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
});
