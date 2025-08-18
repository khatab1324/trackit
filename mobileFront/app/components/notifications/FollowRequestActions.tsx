import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import clsx from "clsx";

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
    <View className="flex-row mt-4 space-x-3">
      <TouchableOpacity
        onPress={onAccept}
        disabled={loadingAccept}
        className={clsx(
          "flex-1 py-3 px-4 rounded-xl items-center justify-center",
          "bg-blue-600",
          "shadow-lg"
        )}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-base">
          {loadingAccept ? "Accepting..." : "Accept"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReject}
        disabled={loadingReject}
        className={clsx(
          "flex-1 py-3 px-4 rounded-xl items-center justify-center",
          "border-2 border-gray-300 dark:border-gray-600",
          "bg-transparent"
        )}
        activeOpacity={0.8}
      >
        <Text className="text-gray-700 dark:text-gray-300 font-semibold text-base">
          {loadingReject ? "Rejecting..." : "Reject"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
