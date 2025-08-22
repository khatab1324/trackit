import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Memory } from "../core/types/memory";
import { colors } from "../core/theme/colors";
import MemoryThumbnail from "../components/MemoryThumbnail";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
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
    profile_image: string;
    bio: string;
  };
};

export default function ProfileContent({
  memories: memoriesList,
  saved: savedList,
  refetch,
  isFetching,
  isOwnProfile,
}: {
  memories: Memory[] | null;
  saved: BookmarkedMemory[] | null;
  refetch: () => void;
  isFetching: boolean;
  isOwnProfile: boolean;
  targetUserId: string | undefined;
}) {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const colorScheme = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState(0);

  const tabsList = isOwnProfile
    ? [
        {
          name: "Memories",
          data: memoriesList,
        },
        {
          name: "Saved",
          data: savedList,
        },
      ]
    : [
        {
          name: "Memories",
          data: memoriesList,
        },
      ];

  console.log("ProfileContent - activeTab:", activeTab);
  console.log("ProfileContent - activeTab name:", tabsList[activeTab]?.name);

  return (
    <View className="flex-1">
      {/* Tabs Section - Above the memories */}
      <View
        className="flex-row border-b mb-4"
        style={{ borderColor: colorScheme.border }}
      >
        {tabsList.map((tab, index) => {
          const isActive = activeTab === index;
          const isSavedTab = tab.name === "Saved";
          return (
            <TouchableOpacity
              key={tab.name}
              className="flex-1 py-3 items-center"
              onPress={() => setActiveTab(index)}
              activeOpacity={0.7}
              style={{
                borderBottomWidth: isActive ? 2 : 0,
                borderColor: isActive
                  ? (isDark ? "#3B82F6" : "#3B82F6")
                  : "transparent",
              }}
            >
              <Ionicons
                name={isSavedTab ? "bookmark-outline" : "grid-outline"}
                size={24}
                color={
                  isActive
                    ? (isDark ? "#3B82F6" : "#3B82F6")
                    : (isDark
                        ? (isSavedTab ? "#9CA3AF" : "#374151")
                        : (isSavedTab ? "#6B7280" : "#9CA3AF"))
                }
              />

            </TouchableOpacity>
          );
        })}
      </View>

      {/* Memories Display Section - Below the tabs */}
      {tabsList[activeTab].data?.length ? (
        <FlatList
          data={tabsList[activeTab].data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Memory | BookmarkedMemory }) => {
            console.log("ProfileContent - renderItem - item:", item);
            console.log(
              "ProfileContent - renderItem - item type:",
              "memory_id" in item ? "BookmarkedMemory" : "Memory"
            );
            // Check if this is a BookmarkedMemory (has memory_id property)
            if ("memory_id" in item) {
              // Transform BookmarkedMemory to Memory format
              const memoryData: Memory = {
                id: item.memory_id,
                content_type: item.content_type,
                content_url: item.content_url,
                count: "0",
                description: item.description,
                isFollowed: false,
                is_saved: true,
                is_liked: false,
                is_requested: false,
                lang: item.latitude,
                long: item.longitude,
                num_comments: "0",
                num_likes: "0",
                userInfo: {
                  user_id: item.user.id,
                  username: item.user.username,
                },
              };
              console.log(
                "ProfileContent - transformed BookmarkedMemory to Memory:",
                memoryData
              );
              return (
                <MemoryThumbnail
                  item={memoryData}
                  nameTap={tabsList[activeTab].name.toLowerCase()}
                />
              );
            } else {
              // This is already a Memory object
              console.log(
                "ProfileContent - using existing Memory object:",
                item
              );
              return (
                <MemoryThumbnail
                  item={item}
                  nameTap={tabsList[activeTab].name.toLowerCase()}
                />
              );
            }
          }}
          onRefresh={refetch}
          refreshing={isFetching}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text
          className="text-center mt-10"
          style={{ color: colorScheme.secondaryText }}
        >
          No memories found.
        </Text>
      )}
    </View>
  );
}
const styles = {};
