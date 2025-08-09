import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export const UserMemo = ({
  username,
  description,
  userId,
}: {
  username: string;
  description?: string;
  userId: string;
}) => {
  return (
    <View className="absolute left-3 right-20 bottom-24">
      <View className="flex-row items-center gap-2 pb-2">
        <TouchableOpacity
          className="text-white text-base font-semibold "
          onPress={() => {}}
        >
          <Text className="text-white font-semibold">@{username}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          className="opacity-100 border-2 border-solid border-white rounded-lg px-3 py-1 "
        >
          <Text className="text-white font-semibold">Follow</Text>
        </TouchableOpacity>
      </View>
      {!!description && (
        <Text className="text-white text-sm mt-1" numberOfLines={2}>
          {description}
        </Text>
      )}
    </View>
  );
};
