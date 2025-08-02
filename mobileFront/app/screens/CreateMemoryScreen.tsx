import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";
import { HeaderForCamera } from "../components/headerForCamera";
import SaveMemoryPic from "../components/SaveMemoryPic";
import { CameraPremiisionDenied } from "../components/CameraPremissionDenied";

type Nav = NativeStackNavigationProp<MainStackParamList, "CreateMemory">;

export default function CreateMemoryScreen() {
  const navigation = useNavigation<Nav>();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

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

  const takePictureHandler = async () => {
    if (cameraRef.current) {
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
      <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing} />
      <SafeAreaView className="absolute inset-0">
        <HeaderForCamera callBackToNavigate={navigation.goBack} />

        <TouchableOpacity
          className="absolute right-5 top-24 h-12 w-12 items-center justify-center rounded-full bg-black/50"
          onPress={flip}
        >
          <Text className="text-xl text-white">🔄</Text>
        </TouchableOpacity>

        <View className="absolute bottom-12 left-0 right-0 items-center">
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
