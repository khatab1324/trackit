import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const InteractionMemo = ({
  num_likes,
  num_comments,
}: {
  num_likes: string;
  num_comments: string;
}) => {
  return (
    <View className="absolute right-3 bottom-24 items-center gap-6">
      <View className="flex-col items-center gap-2">
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="heart-outline" size={32} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg">{num_likes}</Text>
      </View>

      <View className="flex-col items-center gap-2">
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="chatbubble-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg">{num_comments}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.8}>
        <FontAwesome name="bookmark-o" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};
