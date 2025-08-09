import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import type { Memory } from "../core/types/memory";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Expo icon sets
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type Props = {
  memory: Memory;
  screenHeight: number;
  screenWidth: number;
};

export const MemoComponent: React.FC<Props> = ({
  memory,
  screenHeight,
  screenWidth,
}) => {
  const navigation = useNavigation();
  const currentUser = useSelector((state: RootState) => state.user);
  return (
    <View
      className="bg-black relative"
      style={{ height: screenHeight, width: screenWidth }}
    >
      =
      <TouchableOpacity
        className="absolute left-3 top-14 z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={32} color="white" />
      </TouchableOpacity>
      <Image
        source={{ uri: memory.content_url }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute right-3 bottom-24 items-center gap-6">
        {/* TODO: make them into component */}
        <View className="flex-col items-center gap-2">
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg">{memory.num_likes}</Text>
        </View>
        <View className="flex-col items-center gap-2">
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons name="chatbubble-outline" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg ">{memory.num_comments}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8}>
          <FontAwesome name="bookmark-o" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {memory.userInfo.user_id !== currentUser.id && (
        <View className="absolute left-3 right-20 bottom-8">
          <Text className="text-white text-base font-semibold">
            @{memory.userInfo.username}
          </Text>
          {memory.description ? (
            <Text className="text-white text-sm mt-1" numberOfLines={2}>
              {memory.description}
            </Text>
          ) : null}
        </View>
      )}{" "}
    </View>
  );
};
