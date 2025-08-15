import React from "react";
import { View } from "react-native";
import { SearchComponent } from "../components/SearchComponent";
import MapView, { MapStyleElement } from "react-native-maps";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

// ستايل الداكن
const darkMapStyle: MapStyleElement[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#000000" }],
  },
];

// ستايل الفاتح (الافتراضي)
const lightMapStyle: MapStyleElement[] = [];

export const MapScreen = () => {
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const colorScheme = isDark ? colors.dark : colors.light;

  return (
    <View className="flex-1" style={{ backgroundColor: colorScheme.background }}>
      <MapView
        style={{ flex: 1 }}
        customMapStyle={isDark ? darkMapStyle : lightMapStyle}
      />

      <View className="absolute top-12 w-full px-4">
        <View
          className="rounded-2xl shadow-lg p-3"
          style={{ backgroundColor: colorScheme.background }}
        >
          <SearchComponent />
        </View>
      </View>
    </View>
  );
};
