import React, { SetStateAction } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { HeaderForCamera } from "./headerForCamera";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { Dispatch } from "@reduxjs/toolkit";
import { useGetCloudinarySignatureMutation } from "../lib/APIs/RTKQuery/memoryApi";

interface RootStackParamList extends ParamListBase {
  Home: undefined;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SaveMemoryPic({
  photoUri,
  photoUriSetter,
}: {
  photoUri: string;
  photoUriSetter: (value: string | null) => void;
}) {
  const navigation = useNavigation<NavigationProp>();

  const [getCloudinarySignature] = useGetCloudinarySignatureMutation();
  const retakePicture = () => {
    navigation.goBack();
  };

  const saveMemory = async () => {
    if (!photoUri) return;

    try {
      console.log("Saving memory with photo:", photoUri);

      const cloudData = await getCloudinarySignature().unwrap();
      console.log(cloudData);

      if (!cloudData)
        throw new Error("can't get cloaudinary signature from backend");
      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
        type: "image/jpeg",
        name: "memory.jpg",
      } as any);

      formData.append("api_key", cloudData.apiKey);
      formData.append("timestamp", cloudData.timestamp.toString());
      formData.append("signature", cloudData.signature);
      //TODO: make these come form backend
      formData.append("folder", "memories");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Upload success:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <Image source={{ uri: photoUri }} className="flex-1" resizeMode="cover" />
      <SafeAreaView className="absolute inset-0">
        <HeaderForCamera callBackToNavigate={retakePicture} />
        <View className="absolute bottom-12 left-0 right-0 flex-row justify-center space-x-6">
          <TouchableOpacity
            className="flex-1 mx-6 bg-gray-600/80 rounded-lg py-4"
            onPress={() => photoUriSetter(null)}
          >
            <Text className="text-white text-center font-semibold">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 mx-6 bg-blue-500 rounded-lg py-4"
            onPress={saveMemory}
          >
            <Text className="text-white text-center font-semibold">
              Save Memory
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
