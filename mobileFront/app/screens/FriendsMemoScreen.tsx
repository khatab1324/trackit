import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useGetUserFriendsMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";

export default function FriendsMemoScreen() {
  const {
    data,
    isLoading,
    refetch = () => {},
    isFetching = false,
  } = useGetUserFriendsMemoriesQuery();

  console.log("friendss ", data);
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {data && <MemoListComp data={data} refetch={refetch} isFetching={isFetching} />}
    </View>
  );
}
