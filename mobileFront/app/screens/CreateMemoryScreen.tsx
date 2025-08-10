import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";
import { HeaderForCamera } from "../components/headerForCamera";
import SaveMemoryPic from "../components/SaveMemoryPic";
import { CameraPremiisionDenied } from "../components/CameraPremissionDenied";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Nav = NativeStackNavigationProp<MainStackParamList, "CreateMemory">;

type FilterKey = "none" | "warm" | "cool" | "sepia" | "rose" | "dramatic";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "none", label: "Original" },
  { key: "warm", label: "Warm Glow" },
  { key: "cool", label: "Cool" },
  { key: "sepia", label: "Sepia" },
  { key: "rose", label: "Rose" },
  { key: "dramatic", label: "Dramatic" },
];

export default function CreateMemoryScreen() {
  const navigation = useNavigation<Nav>();

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [filter, setFilter] = useState<FilterKey>("none");

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      if (permission?.status === "undetermined") requestPermission();

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus === "granted") {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          console.log("Location captured:", currentLocation);
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    })();
  }, [permission]);

  const flip = () => setFacing((p) => (p === "back" ? "front" : "back"));

  const toggleFlash = () =>
    setFlash((prev) => (prev === "off" ? "on" : prev === "on" ? "auto" : "off"));

  const takePictureHandler = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      setPhotoUri(photo.uri);

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      console.log("Photo saved:", photo.uri);
      console.log("Location captured:", currentLocation);
    } catch (error) {
      console.error("Error taking picture or getting location:", error);
    }
  };

  const renderFilterLayer = () => {
    switch (filter) {
      case "warm":
        return (
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(255,180,120,0.18)",
              "rgba(255,120,0,0.10)",
              "transparent",
            ]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        );
      case "cool":
        return (
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(120,180,255,0.18)",
              "rgba(0,80,255,0.10)",
              "transparent",
            ]}
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
            colors={[
              "rgba(255,0,102,0.14)",
              "rgba(255,200,220,0.06)",
              "transparent",
            ]}
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
  };

  if (!permission || permission.status === "undetermined")
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission…</Text>
      </View>
    );

  if (!permission.granted) return <CameraPremiisionDenied />;

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">
          Location permission is required to proceed.
        </Text>
      </View>
    );
  }

  if (photoUri) {
    return (
      <SaveMemoryPic
        photoUri={photoUri}
        photoUriSetter={setPhotoUri}
        location={location}
      />
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        ref={cameraRef}
        facing={facing}
        flash={flash}
        mode="picture"
      />

      {renderFilterLayer()}

      <SafeAreaView className="absolute inset-0">
        <HeaderForCamera callBackToNavigate={navigation.goBack} />

        <View className="absolute right-5 top-24 items-center">
          <TouchableOpacity
            className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-black/50"
            onPress={toggleFlash}
          >
            {flash === "off" && <Ionicons name="flash-off" size={22} color="#fff" />}
            {flash === "on" && <Ionicons name="flash" size={22} color="#fff" />}
            {flash === "auto" && (
              <Ionicons name="flash-outline" size={22} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-full bg-black/50"
            onPress={flip}
          >
            <Ionicons name="camera-reverse" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-48 left-0 right-0">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <View className="flex-row items-center gap-8">
              {FILTERS.map((f) => {
                const active = f.key === filter;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => setFilter(f.key)}
                    className={`items-center ${active ? "" : "opacity-80"}`}
                  >
                    <View
                      className={`h-12 w-12 rounded-full overflow-hidden border ${
                        active ? "border-white" : "border-white/60"
                      }`}
                    >
                      {f.key === "warm" && <View className="flex-1 bg-orange-300/60" />}
                      {f.key === "cool" && <View className="flex-1 bg-blue-300/60" />}
                      {f.key === "sepia" && <View className="flex-1 bg-amber-700/60" />}
                      {f.key === "rose" && (
                        <LinearGradient
                          colors={["#ff0066aa", "#ffffff00"]}
                          style={{ flex: 1 }}
                        />
                      )}
                      {f.key === "dramatic" && (
                        <LinearGradient
                          colors={["#00000066", "#00000033"]}
                          style={{ flex: 1 }}
                        />
                      )}
                      {f.key === "none" && <View className="flex-1 bg-white/10" />}
                    </View>
                    <Text
                      className={`mt-1 text-xs ${
                        active ? "text-white" : "text-white/80"
                      }`}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View className="absolute bottom-20 left-0 right-0 items-center">
          <TouchableOpacity
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/25"
            onPress={takePictureHandler}
          >
            <View className="h-16 w-16 rounded-full bg-white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
