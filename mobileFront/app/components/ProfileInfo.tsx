import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";
import { Image, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { imgRegistry } from "../core/utils/assetsRegistry";
import { colors } from "../core/theme/colors";
import { useGetUserByIdQuery } from "../lib/APIs/RTKQuery/UserAuth";
import { useMakeFollowRequestMutation, useCancelFollowRequestMutation } from "../lib/APIs/RTKQuery/InteractionApi";
import { useMarkFollowRequested } from "../core/hooks/useFollowRequest";
import { Ionicons } from "@expo/vector-icons";

interface ProfileInfoProps {
  targetUserId?: string;
  memoriesCount?: number;
  friendsCount?: number;
}

export default function ProfileInfo({ targetUserId, memoriesCount = 0, friendsCount = 0 }: ProfileInfoProps) {
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

  // Add local state for immediate UI updates
  const [localRequested, setLocalRequested] = useState(false);
  const [localFollowed, setLocalFollowed] = useState(false);

  const displayUser = isOwnProfile ? user : otherUserData?.user;

  // Update local state when user data changes
  useEffect(() => {
    if (displayUser) {
      const newRequested = displayUser.is_requested || false;
      const newFollowed = displayUser.is_followed || false;
      console.log("ProfileInfo: Updating local state from user data:", {
        userId: displayUser.id,
        is_requested: newRequested,
        is_followed: newFollowed
      });
      setLocalRequested(newRequested);
      setLocalFollowed(newFollowed);
    }
  }, [displayUser]);

  const handleFollow = async () => {
    if (!targetUserId || isOwnProfile || localRequested || localFollowed) return;
    console.log("ProfileInfo: Sending follow request for user:", targetUserId);
    try {
      await makeFollowRequest({ target_id: targetUserId }).unwrap();
      setLocalRequested(true);
      markRequested(targetUserId, true);
      console.log("ProfileInfo: Follow request successful, local state updated");
    } catch (error) {
      console.error("ProfileInfo: Follow request failed:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!targetUserId || isOwnProfile || (!localRequested && !localFollowed)) return;
    console.log("ProfileInfo: Cancelling follow request for user:", targetUserId);
    try {
      await cancelFollowRequest({ target_id: targetUserId }).unwrap();
      setLocalRequested(false);
      setLocalFollowed(false);
      markRequested(targetUserId, false);
      console.log("ProfileInfo: Cancel request successful, local state updated");
    } catch (error) {
      console.error("ProfileInfo: Cancel follow request failed:", error);
    }
  };

  const getFollowButtonText = () => {
    if (isMakingRequest) return "Sending...";
    if (isCancellingRequest) return "Cancelling...";
    if (localFollowed) return "Following";
    if (localRequested) return "Requested";
    return "Follow";
  };

  const getFollowButtonStyle = () => {
    if (localFollowed || localRequested) {
      return {
        backgroundColor: isDark ? "#3B82F6" : colorScheme.background, // blue for dark mode
        borderWidth: 1,
        borderColor: colorScheme.border,
        color: colorScheme.text,
      };
    }
    return {
      backgroundColor: isDark ? "#3B88FF" : colorScheme.black, // blue for dark mode
    };
  };

  const getFollowButtonTextColor = () => {
    if (localFollowed || localRequested) {
      return colorScheme.text;
    }
    return colorScheme.white;
  };

  const handleFollowButtonPress = () => {
    if (localFollowed || localRequested) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  if (!isOwnProfile && isLoading) {
    return (
      <View 
        className="flex-row items-start"
        style={{ backgroundColor: colorScheme.background }}
      >
        <View 
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: colorScheme.secondary }}
        >
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
      <View 
        className="flex-row items-start"
        style={{ backgroundColor: colorScheme.background }}
      >
        <View 
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: colorScheme.secondary }}
        >
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
    <View 
      className="flex-col items-start w-full"
      style={{ backgroundColor: colorScheme.background }}
    >
      <View className="flex-row items-start w-full">
        <Image
          source={{
            uri: displayUser?.profileImage || imgRegistry.defaultProfileIcon,
          }}
          className="w-20 h-20 rounded-full"
          style={{
            borderRadius: 100,
            borderWidth: 2,
            borderColor: colorScheme.primary,
            backgroundColor: colorScheme.secondary,
          }}
        />
        <View className="ml-4 mt-2 flex-1">
          <Text className="text-xl font-bold mb-4" style={{ color: colorScheme.text }}>
            {displayUser?.username || "Username"}
          </Text>
          <View className="flex-row items-center gap-x-24 justify-center">
            <View className="items-center">
              <Text className="text-xl font-bold" style={{ color: colorScheme.text }}>
                {memoriesCount}
              </Text>
              <Text className="text-sm" style={{ color: colorScheme.secondaryText }}>
                Memories
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold" style={{ color: colorScheme.text }}>
                {friendsCount}
              </Text>
              <Text className="text-sm" style={{ color: colorScheme.secondaryText }}>
                Friends
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Bio with full width */}
      <Text style={{ color: colorScheme.secondaryText }} className="mt-4 w-full">
        {displayUser?.bio || "Bio goes here..."}
      </Text>
      
      {!isOwnProfile && (
        <View className="mt-7 ">
          <TouchableOpacity
            onPress={handleFollowButtonPress}
            disabled={isMakingRequest || isCancellingRequest || localFollowed}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "flex-start",
              opacity: (isMakingRequest || isCancellingRequest || localFollowed) ? 0.6 : 1,
              ...getFollowButtonStyle(),
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row gap-1 ">
              {localFollowed && (
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