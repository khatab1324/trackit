import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image } from "react-native";
import { Friend, FriendsListProps } from "../../core/types/friends";
import { imgRegistry } from "../../core/utils/assetsRegistry";

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
      className="flex-row items-center px-4 py-3 border-b"
      onPress={() => onPress(item)}
    >
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : { uri: imgRegistry.defaultProfileIcon }
        }
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium">{item.username}</Text>
        {!!statusLabel && <Text className="text-sm">{statusLabel}</Text>}
      </View>
      {item.status === "online" && (
        <View className="w-3 h-3 rounded-full bg-green-500" />
      )}
    </TouchableOpacity>
  );
};

export const FriendsList: React.FC<FriendsListProps> = ({
  friends = [],
  onPressFriend,
  refetch,
  isFetching,
}) => {
  return (
    <View className="flex-1">
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem item={item} onPress={onPressFriend} />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text>No friends found</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};
