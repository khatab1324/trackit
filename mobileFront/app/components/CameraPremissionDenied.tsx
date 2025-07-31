import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { HeaderForCamera } from "./headerForCamera";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";

export const CameraPremiisionDenied = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
      <HeaderForCamera callBackToNavigate={navigation.goBack} />

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
};
