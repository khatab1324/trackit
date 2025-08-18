import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { useGetCurrentUserMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { useGetUserBookmarksQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { Memory } from "../core/types/memory";
import { useThemeColors } from "../hooks/useThemeColors";
import ThemedView from "../components/ui/ThemedView";
import ThemedText from "../components/ui/ThemedText";
import ProfileInfo from "../components/ProfileInfo";
import ProfileContent from "../components/ProfileContent";

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // نجيب الألوان حسب الثيم
  const c = useThemeColors();

  // queries
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
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={c.text} />
      </ThemedView>
    );
  } else if (isError) {
    content = (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText variant="error">Error fetching memories</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 48 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <ThemedText style={{ fontSize: 22, fontWeight: "bold" }}>
          Profile
        </ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={c.icon.secondary} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <ProfileInfo />

      {/* Counters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 24,
          marginBottom: 40,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            {memories.length || 0}
          </ThemedText>
          <ThemedText variant="muted">Memories</ThemedText>
        </View>
        <View style={{ alignItems: "center" }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>0</ThemedText>
          <ThemedText variant="muted">Friends</ThemedText>
        </View>
      </View>

      {/* Content */}
      {content}
    </ThemedView>
  );
}
