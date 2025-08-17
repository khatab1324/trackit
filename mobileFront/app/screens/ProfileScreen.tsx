import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { useGetCurrentUserMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { Memory } from "../core/types/memory";
import { colors } from "../core/theme/colors";
import ProfileInfo from "../components/ProfileInfo";
import ProfileContent from "../components/ProfileContent";
import { useGetUserBookmarksQuery } from "../lib/APIs/RTKQuery/InteractionApi";

export function ProfileScreen() {
  const theme = useSelector((state: RootState) => state.theme.current);
  const themeColors = colors[theme];

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const { data, isLoading, isError, refetch, isFetching } =
    useGetCurrentUserMemoriesQuery(undefined, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const { data: bookmarks } = useGetUserBookmarksQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const memories = (data as Memory[]) ?? [];

  let content = (
    <ProfileContent
      memories={memories}
      saved={bookmarks}
      refetch={refetch}
      isFetching={isFetching}
    />
  );
  if (isLoading) {
    content = (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={themeColors.text} />
      </View>
    );
  } else if (isError) {
    content = (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-error">Error fetching memories</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-12 bg-background">
      <View className="flex-row items-center justify-between mb-8">
        <Text className="text-2xl font-bold text-text">Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={themeColors.icon.secondary} />
        </TouchableOpacity>
      </View>

      <ProfileInfo />

      <View className="flex-row justify-around mt-6 mb-10">
        <View className="items-center">
          <Text className="text-xl font-bold text-text">
            {memories.length || 0}
          </Text>
          <Text className="text-placeholder">Memories</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-text">0</Text>
          <Text className="text-placeholder">Friends</Text>
        </View>
      </View>

      {content}
    </View>
  );
}
