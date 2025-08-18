import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image } from "react-native";
import { Friend } from "../../core/types/friends";
import { imgRegistry } from "../../core/utils/assetsRegistry";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Ionicons } from "@expo/vector-icons";

const getStatusLabel = (status?: Friend["status"]) => {
  switch (status) {
    case "online":
      return "Online";
    case "away":
      return "Away";
    case "offline":
      return "Offline";
    default:
      return "";
  }
};

const getStatusColor = (status?: Friend["status"]) => {
  switch (status) {
    case "online":
      return "#10B981";
    case "away":
      return "#F59E0B";
    case "offline":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

const FriendItem = ({
  item,
  onPress,
}: {
  item: Friend;
  onPress: (f: Friend) => void;
}) => {
  const statusLabel = getStatusLabel(item.status);
  const statusColor = getStatusColor(item.status);
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  return (
    <TouchableOpacity
      className="mx-4 mb-3"
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center py-3">
        {/* Avatar with Status Ring */}
        <View className="relative">
          <View
            className={clsx(
              "w-16 h-16 rounded-full p-1",
              item.status === "online"
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : item.status === "away"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            )}
          >
            <Image
              source={
                item.avatar
                  ? { uri: item.avatar }
                  : { uri: imgRegistry.defaultProfileIcon }
              }
              className="w-full h-full rounded-full"
            />
          </View>
          
          {/* Status Indicator */}
          <View
            className={clsx(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2",
              isDark ? "border-neutral-800" : "border-white"
            )}
            style={{ backgroundColor: statusColor }}
          />
        </View>

        {/* User Info Section */}
        <View className="flex-1 ml-4">
          <Text
            className={clsx(
              "text-lg font-bold mb-1",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            {item.username}
          </Text>
          
          {!!statusLabel && (
            <View className="flex-row items-center">
              <View
                className="w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: statusColor }}
              />
              <Text
                className={clsx(
                  "text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}
              >
                {statusLabel}
              </Text>
            </View>
          )}
        </View>

        {/* Chat Icon */}
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color={isDark ? "#9CA3AF" : "#6B7280"}
        />
      </View>
    </TouchableOpacity>
  );
};

export const FriendsList: React.FC<{
  friends: Friend[];
  onPressFriend: (friend: Friend) => void;
  refetch: () => void;
  isFetching: boolean;
  searchQuery?: string;
}> = ({ friends = [], onPressFriend, refetch, isFetching, searchQuery }) => {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  return (
    <View className="flex-1 bg-transparent">
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem item={item} onPress={onPressFriend} />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20 px-8">
            <View
              className={clsx(
                "w-28 h-28 rounded-full items-center justify-center mb-6",
                isDark
                  ? "bg-gradient-to-br from-neutral-800 to-neutral-700"
                  : "bg-gradient-to-br from-gray-100 to-gray-200"
              )}
              style={{
                shadowColor: isDark ? "#000" : "#374151",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text className="text-5xl">
                {searchQuery ? "🔍" : "👥"}
              </Text>
            </View>
            
            <Text
              className={clsx(
                "text-xl font-bold text-center mb-3",
                isDark ? "text-white" : "text-gray-800"
              )}
            >
              {searchQuery ? "No friends found" : "No friends found"}
            </Text>
            
            <Text
              className={clsx(
                "text-base text-center mb-4",
                isDark ? "text-gray-400" : "text-gray-600"
              )}
            >
              {searchQuery 
                ? `No friends match "${searchQuery}"`
                : "Start following people to see them here"
              }
            </Text>
            
            {searchQuery && (
              <View
                className={clsx(
                  "px-4 py-2 rounded-full",
                  isDark
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-gray-100 border border-gray-200"
                )}
              >
                <Text
                  className={clsx(
                    "text-sm text-center",
                    isDark ? "text-gray-500" : "text-gray-500"
                  )}
                >
                  Try a different search term
                </Text>
              </View>
            )}
          </View>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingVertical: 20,
          flexGrow: 1,
          minHeight: 200
        }}
        style={{ flex: 1 }}
        decelerationRate="fast"
        snapToInterval={0}
        snapToAlignment="start"
      />
    </View>
  );
};
