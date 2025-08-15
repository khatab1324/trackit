import React from "react";
import { View } from "react-native";
import { SearchComponent } from "../components/SearchComponent";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { colors } from "../core/theme/colors";

// ستايل Google Maps في الوضع الداكن
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

export const MapScreen = () => {
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={isDark ? darkMapStyle : []}
        initialRegion={{
          latitude: 31.963158,
          longitude: 35.930359,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
      <View style={{ position: "absolute", top: 48, width: "100%", paddingHorizontal: 16 }}>
        <View style={{ backgroundColor: themeColors.background, borderRadius: 16, padding: 12 }}>
          <SearchComponent />
        </View>
      </View>
    </View>
  );
};
