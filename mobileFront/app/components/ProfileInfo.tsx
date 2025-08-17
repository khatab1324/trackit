import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";
import { Image, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { imgRegistry } from "../core/utils/assetsRegistry";
import { colors } from "../core/theme/colors";
import { useGetUserByIdQuery } from "../lib/APIs/RTKQuery/UserAuth";
import { useMakeFollowRequestMutation, useCancelFollowRequestMutation } from "../lib/APIs/RTKQuery/InteractionApi";
import { useMarkFollowRequested } from "../core/hooks/useFollowRequest";
import { Ionicons } from "@expo/vector-icons";

interface ProfileInfoProps {
  targetUserId?: string;
}

export default function ProfileInfo({ targetUserId }: ProfileInfoProps) {
  const user = useSelector((state: RootState) => state.user) as User;
  const token = useSelector((state: RootState) => state.auth.token) as string | null;
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const colorScheme = isDark ? colors.dark : colors.light;

  const isOwnProfile = !targetUserId || targetUserId === user?.id;
  const userIdToFetch = isOwnProfile ? user?.id : targetUserId;

  const { data: otherUserData, isLoading, isError } = useGetUserByIdQuery(
    { userId: userIdToFetch!, token: token as string },
    {
      skip: isOwnProfile,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [makeFollowRequest, { isLoading: isMakingRequest }] = useMakeFollowRequestMutation();
  const [cancelFollowRequest, { isLoading: isCancellingRequest }] = useCancelFollowRequestMutation();
  const markRequested = useMarkFollowRequested();

  const displayUser = isOwnProfile ? user : otherUserData?.user;

  const handleFollow = async () => {
    if (!targetUserId || isOwnProfile) return;
    try {
      await makeFollowRequest({ target_id: targetUserId }).unwrap();
      markRequested(targetUserId, true);
    } catch (error) {
      console.error("Follow request failed:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!targetUserId || isOwnProfile) return;
    try {
      await cancelFollowRequest({ target_id: targetUserId }).unwrap();
      markRequested(targetUserId, false);
    } catch (error) {
      console.error("Cancel follow request failed:", error);
    }
  };

  const getFollowButtonText = () => {
    if (isMakingRequest) return "Sending...";
    if (isCancellingRequest) return "Cancelling...";
    if (displayUser?.is_followed) return "Following";
    if (displayUser?.is_requested) return "Requested";
    return "Follow";
  };

  const getFollowButtonStyle = () => {
    if (displayUser?.is_followed || displayUser?.is_requested) {
      return {
        backgroundColor: colorScheme.background,
        borderWidth: 1,
        borderColor: colorScheme.primary,
      };
    }
    return {
      backgroundColor: colorScheme.primary,
    };
  };

  const getFollowButtonTextColor = () => {
    if (displayUser?.is_followed || displayUser?.is_requested) {
      return colorScheme.primary;
    }
    return "#fff";
  };

  const handleFollowButtonPress = () => {
    if (displayUser?.is_followed || displayUser?.is_requested) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  if (!isOwnProfile && isLoading) {
    return (
      <View className="flex-row items-start">
        <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
          <ActivityIndicator size="small" color={colorScheme.primary} />
        </View>
        <View className="ml-4 mt-2">
          <Text className="text-lg font-semibold" style={{ color: colorScheme.text }}>
            Loading...
          </Text>
          <Text style={{ color: colorScheme.secondaryText }}>
            Loading user info...
          </Text>
        </View>
      </View>
    );
  }

  if (!isOwnProfile && isError) {
    return (
      <View className="flex-row items-start">
        <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
          <Text style={{ color: colorScheme.error, fontSize: 12 }}>Error</Text>
        </View>
        <View className="ml-4 mt-2">
          <Text className="text-lg font-semibold" style={{ color: colorScheme.text }}>
            User not found
          </Text>
          <Text style={{ color: colorScheme.secondaryText }}>
            Unable to load user information
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-row items-start">
        <Image
          source={{
            uri: displayUser?.profileImage || imgRegistry.defaultProfileIcon,
          }}
          className="w-20 h-20 rounded-full bg-gray-200"
          style={{
            borderRadius: 100,
            borderWidth: 2,
            borderColor: colorScheme.primary,
          }}
        />
        <View className="ml-4 mt-2">
          <Text className="text-lg font-semibold" style={{ color: colorScheme.text }}>
            {displayUser?.username || "Username"}
          </Text>
          <Text style={{ color: colorScheme.secondaryText }}>
            {displayUser?.bio || "Bio goes here..."}
          </Text>
        </View>
      </View>
      
      {!isOwnProfile && (
        <View className="mt-2">
          <TouchableOpacity
            onPress={handleFollowButtonPress}
            disabled={isMakingRequest || isCancellingRequest}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "center",
              opacity: isMakingRequest || isCancellingRequest ? 0.6 : 1,
              ...getFollowButtonStyle(),
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-1">
              {displayUser?.is_followed && (
                <Ionicons name="checkmark-circle" size={16} color={getFollowButtonTextColor()} />
              )}
              <Text
                style={{
                  color: getFollowButtonTextColor(),
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {getFollowButtonText()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}