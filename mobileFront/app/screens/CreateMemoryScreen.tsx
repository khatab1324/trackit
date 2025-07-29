import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
  PictureRef,
  SavePictureOptions,
} from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<MainStackParamList, "CreateMemory">;

export default function CreateMemoryScreen() {
  const navigation = useNavigation<Nav>();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const cameraRef = useRef<Camera | null>(null);
  useEffect(() => {
    if (permission?.status === "undetermined") requestPermission();
  }, [permission]);

  if (!permission || permission.status === "undetermined")
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission…</Text>
      </View>
    );

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between bg-black/70 px-4 py-3">
          <TouchableOpacity onPress={navigation.goBack}>
            <Text className="text-base font-medium text-white">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Create Memory</Text>
          <View className="w-16" />
        </View>

        <Text className="mb-6 px-6 text-center text-base text-white">
          We need your permission to show the camera
        </Text>

        <TouchableOpacity
          className="rounded-lg bg-blue-500 px-6 py-3"
          onPress={requestPermission}
        >
          <Text className="font-semibold text-white">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const flip = () => setFacing((p) => (p === "back" ? "front" : "back"));
  const takePictureHandler = async () => {
    console.log("enter ");
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhotoUri(photo.uri);
      console.log(photo.uri);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView style={{ flex: 1 }} facing={facing} />
      <SafeAreaView className="absolute inset-0">
        <View className="flex-row items-center justify-between bg-black/70 px-4 py-7">
          <TouchableOpacity onPress={navigation.goBack}>
            <Text className="text-base font-medium text-white">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Create Memory</Text>
        </View>

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
