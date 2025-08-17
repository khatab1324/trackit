import React from "react";
import { View, StyleSheet, Platform, Text, TouchableOpacity, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { hp } from "../core/theme/responsiveHandler";
import { RenderMemoryOnMap } from "./RenderMemoryOnMap";
import { MemoComponent } from "./MemoComponent";
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

  // If a memory is selected, show the MemoComponent
  if (selectedMemory) {
    return (
      <View style={styles.memoContainer}>
        <MemoComponent
          memory={selectedMemory}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
        />
        {/* Back button */}
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
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={{
          latitude: 31.98469,
          longitude: 35.918267,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <RenderMemoryOnMap onMemorySelect={onMemorySelect} />
      </MapView>
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
});
