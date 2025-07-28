import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
} from "react-native-vision-camera";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const CreateMemoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const devices = useCameraDevices();
  const device = devices.back;

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission]);

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <View className="flex-row justify-between items-center px-4 py-3 pt-12 bg-gray-50 border-b border-gray-200">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 text-base font-medium">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        {!hasPermission ? (
          <Text className="text-gray-600 text-base">
            Requesting camera permission...
          </Text>
        ) : !device ? (
          <Text className="text-gray-600 text-base">Loading camera...</Text>
        ) : (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
          />
        )}
      </View>
    </View>
  );
};
