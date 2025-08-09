import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGetUserFriendsMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";

type RouteParams = { userId: string; username?: string };

export default function FriendsMemoScreen() {
  const route = useRoute();
  const { userId, username } = (route.params || {}) as RouteParams;

  const { data, isLoading, isError } = useGetUserFriendsMemoriesQuery({ userId });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-center">Failed to load memories.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <MemoListComp data={data} />
    </View>
  );
}
