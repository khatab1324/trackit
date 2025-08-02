import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { HeaderForCamera } from "./headerForCamera";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import {
  MemoryApi,
  useGetCloudinarySignatureMutation,
  useSaveMemoryMutation,
} from "../lib/APIs/RTKQuery/memoryApi";
import Location from "expo-location";
import { ContentType, MemoryInput } from "../types/memory";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../types/user";
interface RootStackParamList extends ParamListBase {
  Home: undefined;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SaveMemoryPic({
  photoUri,
  photoUriSetter,
  location,
}: {
  photoUri: string;
  photoUriSetter: (value: string | null) => void;
  location: Location.LocationObject | null;
}) {
  const navigation = useNavigation<NavigationProp>();

  const [getCloudinarySignature, { isLoading: isGettingSignature }] =
    useGetCloudinarySignatureMutation();
  const [saveMemory] = useSaveMemoryMutation();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const user = useSelector((state: RootState) => state.user) as User;

  const retakePicture = () => {
    navigation.goBack();
  };

  const saveMemoryHandler = async () => {
    if (!photoUri) return;

    try {
      console.log("Saving memory with photo:", photoUri);
      setIsUploading(true);
      setUploadProgress(10);

      const cloudData = await getCloudinarySignature().unwrap();
      console.log(cloudData);
      setUploadProgress(30);

      if (!cloudData)
        throw new Error("can't get cloudinary signature from backend");

      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
        type: "image/jpeg",
        name: "memory.jpg",
      } as any);
      // TODO : make the cloudinary signed faster
      formData.append("api_key", cloudData.apiKey);
      formData.append("timestamp", cloudData.timestamp.toString());
      formData.append("signature", cloudData.signature);
      formData.append("folder", "memories");

      // TODO: add it to .env this
      // formData.append("upload_preset", "ml_default");
      // formData.append("folder", "memories");

      setUploadProgress(50);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress(80);
      const result = await response.json();
      console.log("Upload success:", result);
      if (!location) throw new Error("location is not define");
      // TODO: this should come from component that user fill it
      const memoryInputObj: MemoryInput = {
        user_id: user.id,
        content_type: ContentType.Image,
        content_url: result.secure_url,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
        title: "Memory from " + new Date().toLocaleDateString(),
        description: "Created with the app",
        isPublic: false,
      };
      console.log("memoryInputObj", memoryInputObj);

      const savedMemoryBackend = await saveMemory(memoryInputObj);
      console.log("Memory saved to backend:", savedMemoryBackend);

      setUploadProgress(100);

      setTimeout(() => {
        photoUriSetter(null);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isProcessing = isGettingSignature || isUploading;

  return (
    <View className="flex-1 bg-black">
      <Image source={{ uri: photoUri }} className="flex-1" resizeMode="cover" />

      {/* Loading Overlay */}
      {isProcessing && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-20">
          <View className="bg-white/90 rounded-lg p-6 items-center min-w-48">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-800 font-semibold mt-4 text-center">
              {isGettingSignature
                ? "Preparing upload..."
                : "Uploading memory..."}
            </Text>
            {isUploading && (
              <>
                <Text className="text-gray-600 mt-2 text-sm">
                  {uploadProgress}% complete
                </Text>
                <View className="w-40 h-2 bg-gray-200 rounded-full mt-2">
                  <View
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      )}

      <SafeAreaView className="absolute inset-0">
        <HeaderForCamera callBackToNavigate={retakePicture} />

        <View className="absolute bottom-12 left-0 right-0 flex-row justify-center space-x-6">
          <TouchableOpacity
            className={`flex-1 mx-6 rounded-lg py-4 ${
              isProcessing ? "bg-gray-400" : "bg-gray-600/80"
            }`}
            onPress={() => photoUriSetter(null)}
            disabled={isProcessing}
          >
            <Text className="text-white text-center font-semibold">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 mx-6 rounded-lg py-4 ${
              isProcessing ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={saveMemoryHandler}
            disabled={isProcessing}
          >
            <Text className="text-white text-center font-semibold">
              {isProcessing ? "Processing..." : "Save Memory"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
