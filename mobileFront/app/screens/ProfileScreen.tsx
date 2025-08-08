import React, { useState } from "react";
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

export function ProfileScreen() {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const colorScheme = isDark ? colors.dark : colors.light;

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // Use query hook (auto-cache, status flags)
  const { data, isLoading, isError } = useGetCurrentUserMemoriesQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const memories = (data as Memory[]) ?? [];

  let content = <ProfileContent memories={memories} saved={[]} />;
  if (isLoading) {
    content = (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (isError) {
    content = (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: colorScheme.error }}>
          Error fetching memories
        </Text>
      </View>
    );
  }

  const styles = {
    container: { backgroundColor: colorScheme.background },
    text: { color: colorScheme.text },
    secondaryText: { color: colorScheme.secondaryText },
  };

  return (
    <View className={`flex-1 px-4 pt-12`} style={styles.container}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`text-2xl font-bold`} style={styles.text}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={colorScheme.icon.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <ProfileInfo />

      {/* Stats */}
      <View className="flex-row justify-around mt-6 mb-10">
        <View className="items-center">
          <Text
            className={`text-lg font-bold text-red-400`}
            style={styles.text}
          >
            {memories.length || 0}
          </Text>
          <Text style={styles.secondaryText}>Memories</Text>
        </View>
        <View className="items-center">
          <Text className={`text-lg font-bold`} style={styles.text}>
            0
          </Text>
          <Text style={styles.secondaryText}>Friends</Text>
        </View>
      </View>

      {content}
    </View>
  );
}
