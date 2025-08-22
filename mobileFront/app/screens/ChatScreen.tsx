import React, { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { FriendsList } from "../components/chat/FriendsList";
import { useGetCurrentUserFollowersQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import clsx from "clsx";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";
import { Ionicons } from "@expo/vector-icons";

export const ChatScreen = () => {
  const isDark = useAppSelector((state: RootState) => state.sheardDataThrowApp.darkMode);

  const {
    data: friends,
    isLoading,
    refetch,
    isFetching,
  } = useGetCurrentUserFollowersQuery();

  const {
    selectedFriend,
    isChatLoading,
    onPressFriend,
  } = useChatWithFriend();


  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const filteredFriends = useMemo(() => {
    if (!debouncedQuery.trim()) return friends || [];
    return (friends || []).filter((friend) =>
      friend.username?.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, friends]);

  const isSearching = searchQuery !== debouncedQuery;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        <Text className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Loading friends...
        </Text>
      </View>
    );
  }

  if (isChatLoading && selectedFriend) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-500 dark:bg-neutral-900">
        <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        <Text className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-2">
          Connecting to chat...
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-500">
          Please wait a moment
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <View className="pt-16 pb-6 px-6">
        <View className="mb-6">
          <Text
            className={clsx(
              "text-3xl font-bold mb-2",
              isDark ? "text-gray-300" : "text-gray-900"
            )}
          >
            Messages
          </Text>
          <Text className={clsx(
            "text-sm mb-2",
            isDark ? "text-gray-500" : "text-gray-700"
          )}>
            Chat with your friends and followers
          </Text>
        </View>

        {/* Enhanced Search Bar */}
        <View className="mb-4">
          <View
            className={clsx(
              "flex-row items-center rounded-2xl px-4 h-14",
              isDark ? "bg-neutral-800" : "bg-gray-100",        // softer backgrounds
              isDark ? "border-neutral-600" : "border-gray-300", // distinct borders
              "border-2 shadow-sm",
              isSearchFocused &&
              (isDark
                ? "border-blue-400 shadow-blue-500/20 shadow-md"
                : "border-blue-500 shadow-blue-500/20 shadow-md")
            )}
            style={{
              transform: [{ scale: isSearchFocused ? 1.02 : 1 }],
            }}
          >
            <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
              <Ionicons
                name="search"
                size={18}
                color={isDark ? "64748B" : "##94A3B8"}
              />
            </View>

            <TextInput
              className="flex-1 text-base font-medium text-white" // 👈 text color white for contrast
              style={{
                backgroundColor: "transparent", // 👈 let parent handle background
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search friends..."
              placeholderTextColor={isDark ? "#6B7280" : "#6B7280"} // lighter gray
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                hitSlop={10}
                className="w-8 h-8 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              </TouchableOpacity>
            )}
          </View>


          {/* Search Results Count */}
          {searchQuery.length > 0 && (
            <View
              className="mt-3 px-2 flex-row items-center"
              style={{
                opacity: isSearching ? 0.7 : 1,
                transform: [{ scale: isSearching ? 0.98 : 1 }],
              }}
            >
              {isSearching ? (
                <>
                  <ActivityIndicator size="small" color={isDark ? "#60A5FA" : "#3B82F6"} />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    Searching...
                  </Text>
                </>
              ) : (
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredFriends.length} friend{filteredFriends.length !== 1 ? 's' : ''} found
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Friends List Section */}
      <View className={clsx(isDark ? "flex-1 bg-gray-950" : "flex-1 bg-white rounded-t-3xl shadow-2xl dark:shadow-neutral-900/50")}>
        <View className="w-16 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full mx-auto mt-4 mb-2" />
        <View className="flex-1 px-2">
          <FriendsList
            friends={filteredFriends}
            onPressFriend={onPressFriend}
            refetch={refetch}
            isFetching={isFetching}
            searchQuery={debouncedQuery}
          />
        </View>
      </View>
    </View>
  );
};
