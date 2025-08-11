import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { MainStackParamList } from "../../App";
import { RootState } from "../store";
import CameraTopBar from "../components/CameraTopBar";
import SaveMemoryPic from "../components/SaveMemoryPic";
import { CameraPremiisionDenied } from "../components/CameraPremissionDenied";
import CameraFilterOverlay, { FilterKey } from "../components/CameraFilterOverlay";
import FilterCarousel from "../components/FilterCarousel";
import CameraSideToolbar from "../components/CameraSideToolbar";
import ShutterButton from "../components/ShutterButton";

type Nav = NativeStackNavigationProp<MainStackParamList, "CreateMemory">;

export default function CreateMemoryScreen() {
  const navigation = useNavigation<Nav>();

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [filter, setFilter] = useState<FilterKey>("none");

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const coords = useSelector((s: RootState) => s.sheardDataThrowApp.location);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      if (permission?.status === "undetermined") {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  const flip = () => setFacing((p) => (p === "back" ? "front" : "back"));

  const toggleFlash = () =>
    setFlash((prev) => (prev === "off" ? "on" : prev === "on" ? "auto" : "off"));

  const takePictureHandler = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await (cameraRef.current as any).takePictureAsync({ quality: 0.7 });
      setPhotoUri(photo.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission || permission.status === "undetermined") {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) return <CameraPremiisionDenied />;

  if (!coords) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-center">
          Waiting for location… Please allow location access on Home first.
        </Text>
      </View>
    );
  }

  if (photoUri) {
    return (
      <SaveMemoryPic
        photoUri={photoUri}
        photoUriSetter={setPhotoUri}
        location={coords}
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

      <CameraFilterOverlay filter={filter} />

      <SafeAreaView className="absolute inset-0">
        <CameraTopBar onBack={navigation.goBack} title="Preview" />

        <CameraSideToolbar
          flash={flash}
          onToggleFlash={toggleFlash}
          onFlipCamera={flip}
        />

        <View className="absolute bottom-48 left-0 right-0">
          <FilterCarousel value={filter} onChange={setFilter} />
        </View>

        <ShutterButton
          className="absolute bottom-20 left-0 right-0"
          onPress={takePictureHandler}
          loading={isCapturing}
          disabled={isCapturing}
          size={80}
          innerSize={64}
        />
      </SafeAreaView>
    </View>
  );
}
