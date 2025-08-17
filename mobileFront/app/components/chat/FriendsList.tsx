import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image } from "react-native";
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
        <Text
          className="text-base font-medium text-text"
        >
          {item.username}
        </Text>
        {!!statusLabel && (
          <Text className="text-sm text-placeholder">
            {statusLabel}
          </Text>
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
  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem item={item} onPress={onPressFriend} />
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <Text className="text-placeholder">
              No friends found
            </Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};
