import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { HeaderForCamera } from "./headerForCamera";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { ThemedText } from "./ThemedText";

export const CameraPremiisionDenied = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
      <HeaderForCamera callBackToNavigate={navigation.goBack} />

      <ThemedText className="mb-6 px-6 text-center text-base">
        We need your permission to show the camera
      </ThemedText>

      <TouchableOpacity
        className="rounded-lg bg-blue-500 px-6 py-3"
        onPress={requestPermission}
      >
        <ThemedText className="font-semibold">Grant Permission</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
