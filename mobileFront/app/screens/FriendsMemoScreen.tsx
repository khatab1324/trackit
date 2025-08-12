import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FriendsList } from "../components/chat/FriendsList";
import {
  useGetCurrentUserFollowersQuery,
  useGetUserBookmarksQuery,
} from "../lib/APIs/RTKQuery/InteractionApi";
import { Friend } from "../core/types/friends";

export default function FriendsMemoScreen() {
  const {
    data: friends,
    isLoading,
    refetch,
    isFetching,
  } = useGetCurrentUserFollowersQuery();
  const onPressFriend = (friend: Friend) => {
    console.log("Selected friend:", friend);
  };
  console.log("friendss ", friends);
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FriendsList
        friends={friends}
        onPressFriend={onPressFriend}
        refetch={refetch}
        isFetching={isFetching}
      />
    </View>
  );
}
