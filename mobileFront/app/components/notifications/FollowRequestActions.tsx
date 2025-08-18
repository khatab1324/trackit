import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "../../hooks/useThemeColors";

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
  const themeColors = useThemeColors();
  return (
    <View className="flex-row mt-2">
      <TouchableOpacity
        onPress={onAccept}
        disabled={loadingAccept}
        className="px-3 py-1.5 rounded-full mr-2"
        style={{ backgroundColor: themeColors.primary }}
        activeOpacity={0.8}
      >
        <ThemedText>{loadingAccept ? "..." : "Accept"}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReject}
        disabled={loadingReject}
        className="px-3 py-1.5 rounded-full"
        style={{ borderColor: themeColors.border, borderWidth: 1 }}
        activeOpacity={0.8}
      >
        <ThemedText>{loadingReject ? "..." : "Reject"}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};
