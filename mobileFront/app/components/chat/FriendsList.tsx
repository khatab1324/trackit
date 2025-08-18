import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useThemeColors } from "../../hooks/useThemeColors";
import { ThemedText } from "../ThemedText";
import { Friend } from "../../core/types/friends";
import { imgRegistry } from "../../core/utils/assetsRegistry";
import { colors } from "../../core/theme/colors";

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

const FriendItem = ({
  item,
  onPress,
}: {
  item: Friend;
  onPress: (f: Friend) => void;
}) => {
  const statusLabel = getStatusLabel(item.status);
  const themeColors = useThemeColors();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        // 🔴 شيلنا الخطوط (ما في borderBottom)
      }}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : { uri: imgRegistry.defaultProfileIcon }
        }
        style={{ width: 48, height: 48, borderRadius: 24 }}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <ThemedText
          className="text-base font-medium text-text"
        >
          {item.username}
        </ThemedText>
        {!!statusLabel && (
          <ThemedText className="text-sm text-placeholder">
            {statusLabel}
          </ThemedText>
        )}
      </View>
      {item.status === "online" && (
        <View
          className="w-3 h-3 rounded-full bg-green-500"
        />
      )}
    </TouchableOpacity>
  );
};

export const FriendsList: React.FC<{
  friends: Friend[];
  onPressFriend: (friend: Friend) => void;
  refetch: () => void;
  isFetching: boolean;
}> = ({ friends = [], onPressFriend, refetch, isFetching }) => {
  const themeColors = useThemeColors();
  const isLoading = isFetching;
  const filteredFriends = friends;

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      onPress={() => onPressFriend(item)}
    >
      <View className="flex-row items-center justify-between p-3">
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full bg-gray-200"
            style={{ backgroundColor: themeColors.card }}
          />
          <ThemedText className="ml-3 text-base font-medium">
            {item.username}
          </ThemedText>
        </View>
        <ThemedText type="placeholder" className="text-sm">
          {item.is_online ? "Online" : "Offline"}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={themeColors.text} />
          <ThemedText type="placeholder" className="mt-2">Loading friends...</ThemedText>
        </View>
      ) : (filteredFriends.length === 0 && !isLoading) ? (
        <View className="flex-1 justify-center items-center">
          <ThemedText type="placeholder">No friends found.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
