import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type FilterKey = "none" | "warm" | "cool" | "sepia" | "rose" | "dramatic";

type Props = { filter: FilterKey };

export default function CameraFilterOverlay({ filter }: Props) {
  switch (filter) {
    case "warm":
      return (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,180,120,0.18)", "rgba(255,120,0,0.10)", "transparent"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      );
    case "cool":
      return (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(120,180,255,0.18)", "rgba(0,80,255,0.10)", "transparent"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      );
    case "sepia":
      return (
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
          className="bg-amber-700/22"
        />
      );
    case "rose":
      return (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,0,102,0.14)", "rgba(255,200,220,0.06)", "transparent"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      );
    case "dramatic":
      return (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.15)", "transparent"]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      );
    default:
      return null; 
  }
}
