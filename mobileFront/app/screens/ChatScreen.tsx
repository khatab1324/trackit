import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FriendsList } from "../components/chat/FriendsList";
import { useGetCurrentUserFollowersQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import FriendsSearchBar from "../components/chat/FriendsSearchBar";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const ChatScreen = () => {
  const {
    data: friends,
    isLoading,
    refetch,
    isFetching,
  } = useGetCurrentUserFollowersQuery();

  const {
    selectedFriend,
    chatData,
    isChatLoading,
    isConnected,
    onPressFriend,
    sendMessage,
  } = useChatWithFriend();

  const navigation = useNavigation<any>();
  const theme = useSelector((state: RootState) => state.theme.current);
  const isDarkMode = theme === 'dark';

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={isDarkMode ? 'white' : 'black'} />
      </View>
    );
  }

  if (isChatLoading && selectedFriend) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg mb-4 text-text">Connecting to chat...</Text>
        <ActivityIndicator size="large" color={isDarkMode ? 'white' : 'black'} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-900/30" />
      <View className="flex-1 pt-4">
        <View className="px-5">
          <View style={{ marginTop: 30 }}>
            <FriendsSearchBar />
          </View>
        </View>

        <View className="flex-1 mt-4 rounded-t-3xl bg-card pt-2">
          <FriendsList
            friends={friends ?? []}
            onPressFriend={(friend) => {

              navigation.navigate("Conversation", {
                friendId: friend.id,
                friendName: friend.username || friend.username || "User",
              });
              onPressFriend(friend);

            }}
            refetch={refetch}
            isFetching={isFetching}
          />
        </View>
      </View>
    </View>
  );
};
