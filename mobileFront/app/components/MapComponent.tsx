import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

// ستايل Google Maps للوضع الداكن
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#303030" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
];

export const MapComponent = () => {
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsMyLocationButton={true}
        customMapStyle={isDark ? darkMapStyle : []}
        initialRegion={{
          latitude: 31.98469,
          longitude: 35.918267,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <RenderMemoryOnMap /> */}
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
