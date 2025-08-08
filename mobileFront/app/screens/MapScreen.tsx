import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import MapView from "react-native-maps";
import { SearchComponent } from "../components/SearchComponent";
import { MapComponent } from "../components/MapComponent";
export const MapScreen = () => {
  return (
    <View className="flex-1">
      <MapComponent />
      <View className="absolute top-12 w-full px-4">
        <View className="bg-white rounded-2xl shadow-lg p-3">
          <SearchComponent />
        </View>
      </View>
      <View className="absolute left-0 top-0 w-full">
        <View className="bg-slate-600 opacity-45 shadow-lg p-5"></View>
      </View>
    </View>
  );
};
