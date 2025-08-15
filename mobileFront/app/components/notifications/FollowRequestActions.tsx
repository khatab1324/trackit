import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  onAccept?: () => void;
  onReject?: () => void;
  loadingAccept?: boolean;
  loadingReject?: boolean;
};

export const FollowRequestActions: React.FC<Props> = ({
  onAccept,
  onReject,
  loadingAccept,
  loadingReject,
}) => {
  return (
    <View className="flex-row mt-2">
      <TouchableOpacity
        onPress={onAccept}
        disabled={loadingAccept}
        className="bg-black px-3 py-1.5 rounded-full mr-2"
        activeOpacity={0.8}
      >
        <Text className="text-white">{loadingAccept ? "..." : "Accept"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReject}
        disabled={loadingReject}
        className="border border-gray-400 px-3 py-1.5 rounded-full"
        activeOpacity={0.8}
      >
        <Text className="text-black dark:text-white">
          {loadingReject ? "..." : "Reject"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
