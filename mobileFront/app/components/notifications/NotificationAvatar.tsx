import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type Props = {
  avatar?: string;
  userId: string;
};

export const NotificationAvatar = ({ avatar, userId }: Props) => {
  const navigation = useNavigation<any>();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);

  const goToProfile = () =>
    navigation.navigate("Profile", { userId });

  return (
    <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
      {avatar ? (
        <View className={clsx(
          "w-12 h-12 rounded-full shadow-lg",
          "border-2",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <Image 
            source={{ uri: avatar }} 
            className="w-full h-full rounded-full"
          />
        </View>
      ) : (
        <View className={clsx(
          "w-12 h-12 rounded-full items-center justify-center shadow-lg",
          "border-2",
          isDark 
            ? "bg-gray-700 border-gray-600" 
            : "bg-gray-200 border-gray-300"
        )}>
          <Ionicons 
            name="person" 
            size={20} 
            color={isDark ? "#9CA3AF" : "#6B7280"} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
