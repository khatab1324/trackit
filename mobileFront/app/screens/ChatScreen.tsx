import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FriendsList } from "../components/chat/FriendsList";
import { useGetCurrentUserFollowersQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { Friend } from "../core/types/friends";
import FriendsSearchBar from "../components/chat/FriendsSearchBar";

export const ChatScreen = () => {
  const {
    data: friends,
    isLoading,
    refetch,
    isFetching,
  } = useGetCurrentUserFollowersQuery();
  const onPressFriend = (friend: Friend) => {
    console.log("Selected friend:", friend);
  };
  console.log("Friends data:", friends);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-900/30" />
      <View className="flex-1 pt-4">
        <View className="px-5">
          <View className="mt-4">
            <FriendsSearchBar />
          </View>
        </View>

        <View className="flex-1 mt-4 rounded-t-3xl bg-white dark:bg-neutral-950 pt-2">
          <FriendsList
            friends={friends}
            onPressFriend={onPressFriend}
            refetch={refetch}
            isFetching={isFetching}
          />{" "}
        </View>
      </View>
    </View>
  );
};
