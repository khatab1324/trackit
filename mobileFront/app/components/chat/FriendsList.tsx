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
  themeColors,
}: {
  item: Friend;
  onPress: (f: Friend) => void;
  themeColors: typeof colors.light;
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
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: themeColors.text,
          }}
        >
          {item.username}
        </Text>
        {!!statusLabel && (
          <Text style={{ fontSize: 14, color: themeColors.secondaryText }}>
            {statusLabel}
          </Text>
        )}
      </View>
      {item.status === "online" && (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "green",
          }}
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
  themeColors: typeof colors.light;
}> = ({ friends = [], onPressFriend, refetch, isFetching, themeColors }) => {
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem item={item} onPress={onPressFriend} themeColors={themeColors} />
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
            <Text style={{ color: themeColors.secondaryText }}>
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
