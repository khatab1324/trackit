import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { colors } from "../core/theme/colors";
import ProfileInfo from "../components/ProfileInfo";
import ProfileContent from "../components/ProfileContent";
import { useGetUserBookmarksQuery } from "../lib/APIs/RTKQuery/InteractionApi";

export function ProfileScreen() {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const themeColors = isDark ? colors.dark : colors.light;
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
    content = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: themeColors.secondaryText }}>Loading...</Text>
      </View>
    );
  } else if (isError) {
    content = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: themeColors.error }}>
          Error fetching profile data
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 48,
        backgroundColor: themeColors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{ fontSize: 22, fontWeight: "bold", color: themeColors.text }}
        >
          {isOwnProfile ? "Profile" : "User Profile"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!isOwnProfile && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={themeColors.icon.secondary}
              />
            </TouchableOpacity>
          )}
          {isOwnProfile && (
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Ionicons
                name="settings-outline"
                size={24}
                color={themeColors.icon.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ProfileInfo targetUserId={targetUserId} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 24,
          marginBottom: 40,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: themeColors.text,
            }}
          >
            {memories.length || 0}
          </Text>
          <Text style={{ color: themeColors.secondaryText }}>Memories</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: themeColors.text,
            }}
          >
            0
          </Text>
          <Text style={{ color: themeColors.secondaryText }}>Friends</Text>
        </View>
      </View>

      {content}
    </View>
  );
}
