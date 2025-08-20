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
      saved={isOwnProfile ? bookmarks : null}
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

        {/* Profile Info Section */}
        <ProfileInfo targetUserId={targetUserId} />

        {/* Instagram-style Stats Section */}
        <View className="flex-row justify-around mt-8 mb-6 py-4">
          <View className="items-center">
            <Text className={clsx(
              "text-2xl font-bold mb-1",
              isDark ? "text-white" : "text-black"
            )}>
              {memories.length || 0}
            </Text>
            <Text className={clsx(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Memories
            </Text>
          </View>
          
          <View className="items-center">
            <Text className={clsx(
              "text-2xl font-bold mb-1",
              isDark ? "text-white" : "text-black"
            )}>
              0
            </Text>
            <Text className={clsx(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Friends
            </Text>
          </View>

          <View className="items-center">
            <Text className={clsx(
              "text-2xl font-bold mb-1",
              isDark ? "text-white" : "text-black"
            )}>
              {isOwnProfile ? (bookmarks?.length || 0) : 0}
            </Text>
            <Text className={clsx(
              "text-sm font-medium",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Saved
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {isOwnProfile && (
          <View className="flex-row space-x-3 mb-6">
            <TouchableOpacity 
              className={clsx(
                "flex-1 py-3 rounded-lg items-center",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}
              activeOpacity={0.7}
            >
              <Text className={clsx(
                "font-semibold",
                isDark ? "text-white" : "text-black"
              )}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={clsx(
                "flex-1 py-3 rounded-lg items-center",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}
              activeOpacity={0.7}
            >
              <Text className={clsx(
                "font-semibold",
                isDark ? "text-white" : "text-black"
              )}>
                Share Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content Tabs */}
        <View className="flex-row border-b mb-4">
          <TouchableOpacity className="flex-1 py-3 items-center">
            <Ionicons 
              name="grid-outline" 
              size={24} 
              color={isDark ? "#3B82F6" : "#3B82F6"} 
            />
            <Text className={clsx(
              "text-xs mt-1 font-medium",
              isDark ? "text-blue-500" : "text-blue-600"
            )}>
              Memories
            </Text>
          </TouchableOpacity>
          
          {isOwnProfile && (
            <TouchableOpacity className="flex-1 py-3 items-center">
              <Ionicons 
                name="bookmark-outline" 
                size={24} 
                color={isDark ? "#9CA3AF" : "#6B7280"} 
              />
              <Text className={clsx(
                "text-xs mt-1 font-medium",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Saved
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1">
        {content}
      </View>
    </ScrollView>
  );
}
