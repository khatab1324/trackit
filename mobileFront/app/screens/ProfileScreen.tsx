import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import {
  useGetCurrentUserMemoriesQuery,
  useGetUserMemoQuery,
} from "../lib/APIs/RTKQuery/memoryApi";
import ProfileInfo from "../components/ProfileInfo";
import ProfileContent from "../components/ProfileContent";
import { useGetUserBookmarksQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import clsx from "clsx";


// Define the BookmarkedMemory type that matches the backend response structure
type BookmarkedMemory = {
  id: string;
  memory_id: string;
  saved_at: string;
  title: string;
  description?: string;
  content_url: string;
  content_type: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
  created_at: string;
  user: {
    id: string;
    username: string;
    
  };
};

export function ProfileScreen() {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const currentUser = useSelector((state: RootState) => state.user);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, "Profile">>();
  const { userId } = route.params || {};

  const currentUserId = (currentUser as any)?.id;
  const isOwnProfile = !userId || userId === currentUserId;
  const targetUserId = userId || currentUserId;

  const currentUserMemories = useGetCurrentUserMemoriesQuery(undefined, {
    skip: !isOwnProfile,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const bookmarksQuery = useGetUserBookmarksQuery(undefined, {
    skip: !isOwnProfile,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const userMemoQuery = useGetUserMemoQuery(targetUserId ?? "", {
    skip: isOwnProfile,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const data = isOwnProfile
    ? currentUserMemories.data
    : userMemoQuery.data;

  const isLoading = isOwnProfile
    ? currentUserMemories.isLoading || bookmarksQuery.isLoading
    : userMemoQuery.isLoading;

  const isError = isOwnProfile
    ? currentUserMemories.isError || bookmarksQuery.isError
    : userMemoQuery.isError;

  const isFetching = isOwnProfile
    ? currentUserMemories.isFetching || bookmarksQuery.isFetching
    : userMemoQuery.isFetching;

  const refetch = useCallback(() => {
    if (isOwnProfile) {
      return Promise.all([
        currentUserMemories.refetch(),
        bookmarksQuery.refetch(),
      ]);
    }
    return userMemoQuery.refetch();
  }, [
    isOwnProfile,
    currentUserMemories,
    bookmarksQuery,
    userMemoQuery,
  ]);

  const bookmarks = isOwnProfile ? bookmarksQuery.data ?? null : null;
  const memories = data ?? [];

  // Transform bookmarks to match the expected BookmarkedMemory type
  const transformedBookmarks = bookmarks ? bookmarks.map(bookmark => ({
    id: bookmark.id,
    memory_id: bookmark.memory_id,
    saved_at: bookmark.saved_at,
    title: bookmark.title, // Direct property, not nested
    description: bookmark.description, // Direct property, not nested
    content_url: bookmark.content_url, // Direct property, not nested
    content_type: bookmark.content_type, // Direct property, not nested
    latitude: bookmark.latitude, // Direct property, not nested
    longitude: bookmark.longitude, // Direct property, not nested
    isPublic: bookmark.isPublic, // Direct property, not nested
    created_at: bookmark.created_at, // Direct property, not nested
    user: {
      id: bookmark.user.id,
      username: bookmark.user.username,
      profile_image: bookmark.user.profile_image || "",
      bio: bookmark.user.bio || "",
    },
  })) : null;

  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center">
      <View className={clsx(
        "w-20 h-20 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
      <Text className={clsx(
        "text-lg font-medium",
        isDark ? "text-gray-300" : "text-gray-600"
      )}>
        Loading profile...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className={clsx(
        "w-24 h-24 rounded-full items-center justify-center mb-6",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        <Ionicons 
          name="alert-circle-outline" 
          size={48} 
          color={isDark ? "#F87171" : "#DC2626"} 
        />
      </View>
      <Text className={clsx(
        "text-xl font-semibold mb-2",
        isDark ? "text-white" : "text-black"
      )}>
        Failed to load profile
      </Text>
      <Text className={clsx(
        "text-base text-center px-8",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Pull down to refresh and try again
      </Text>
    </View>
  );

  let content = (
    <ProfileContent
      memories={memories}
      saved={isOwnProfile ? transformedBookmarks : null}
      refetch={refetch}
      isFetching={isFetching}
      isOwnProfile={isOwnProfile}
      targetUserId={targetUserId}
    />
  );

  if (isLoading) {
    content = renderLoadingState();
  } else if (isError) {
    content = renderErrorState();
  }

  return (
    <ScrollView 
      className={clsx(
        "flex-1",
        isDark ? "bg-black" : "bg-white"
      )}
      showsVerticalScrollIndicator={false}
    >
      {/* Instagram-style Header */}
      <View className="px-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className={clsx(
            "text-2xl font-bold",
            isDark ? "text-white" : "text-black"
          )}>
            {isOwnProfile ? "Profile" : "User Profile"}
          </Text>
          <View className="flex-row items-center space-x-3">
            {!isOwnProfile && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className={clsx(
                  "w-10 h-10 rounded-full items-center justify-center",
                  isDark ? "bg-gray-800" : "bg-gray-100"
                )}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={isDark ? "#ffffff" : "#000000"}
                />
              </TouchableOpacity>
            )}
            {isOwnProfile && (
              <TouchableOpacity 
                onPress={() => navigation.navigate("Settings")}
                className={clsx(
                  "w-10 h-10 rounded-full items-center justify-center",
                  isDark ? "bg-gray-800" : "bg-gray-100"
                )}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={isDark ? "#ffffff" : "#000000"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="mb-4">
          <ProfileInfo 
            targetUserId={targetUserId} 
            memoriesCount={memories.length}
            friendsCount={0} // TODO: Add friends count when available
          />
        </View>
      </View>
      <View className="flex-1">
        {content}
      </View>
    </ScrollView>
  );
}
