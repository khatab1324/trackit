import React from "react";
import { View, FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { colors } from "../../core/theme/colors";
import { Friend } from "../../core/types/friends";
import { FriendItem } from "./FriendItem";

type FriendsListProps = {
  friends: Friend[];
  onPressFriend: (friend: Friend) => void;
  refetch: () => void;
  isFetching: boolean;
  themeColors: typeof colors.light;
};

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  onPressFriend,
  refetch,
  isFetching,
  themeColors
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem
            item={item}
            onPress={onPressFriend}
            themeColors={themeColors}
          />
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: themeColors.secondaryText }}>No friends found</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};
