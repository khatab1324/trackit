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
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (isError) {
    content = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: themeColors.error }}>Error fetching memories</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 48, backgroundColor: themeColors.background }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: themeColors.text }}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={themeColors.icon.secondary} />
        </TouchableOpacity>
      </View>

      <ProfileInfo />

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 24, marginBottom: 40 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: themeColors.text }}>
            {memories.length || 0}
          </Text>
          <Text style={{ color: themeColors.secondaryText }}>Memories</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: themeColors.text }}>0</Text>
          <Text style={{ color: themeColors.secondaryText }}>Friends</Text>
        </View>
      </View>

      {content}
    </View>
  );
}
