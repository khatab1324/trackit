import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { RenderMemoryOnMap } from "./RenderMemoryOnMap";
import { useSelector } from "react-redux";
import { MemoryApi } from "../lib/APIs/RTKQuery/memoryApi";

export const MapComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 31.98469,
          longitude: 35.918267,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <RenderMemoryOnMap />
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
