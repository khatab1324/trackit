import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMakeFollowRequestMutation, useCancelFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";

export const UserMemo = ({
  username,
  description,
  userId,
  currentUserId,
  isFollowed,
  isRequested,
}: {
  username: string;
  description?: string;
  userId: string;
  currentUserId?: string;
  isFollowed: boolean;
  isRequested: boolean;
}) => {
 //TODO: refact this file 
  const [makeFollowRequest, { isLoading: isMakingRequest }] = useMakeFollowRequestMutation();
  const [cancelFollowRequest, { isLoading: isCancellingRequest }] = useCancelFollowRequestMutation();
  const [localRequested, setLocalRequested] = useState(isRequested);
  const [localFollowed, setLocalFollowed] = useState(isFollowed);

  const onPressFollowHandler = async () => {
    if (isMakingRequest || localRequested || localFollowed) return;
    try {
      await makeFollowRequest({ target_id: userId }).unwrap();
      setLocalRequested(true);
    } catch (e) {
      console.log("Follow request failed", e);
    }
  };

  const onPressCancelRequestHandler = async () => {
    if (isCancellingRequest || !localRequested) return;
    try {
      await cancelFollowRequest({ target_id: userId }).unwrap();
      setLocalRequested(false);
    } catch (e) {
      console.log("Cancel follow request failed", e);
    }
  };

  const showFollow = currentUserId ? currentUserId !== userId : true;
  const isLoading = isMakingRequest || isCancellingRequest;

  return (
    <View className="absolute left-3 right-20 bottom-24">
      <View className="flex-row items-center gap-2 pb-2">
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-white font-semibold">@{username}</Text>
        </TouchableOpacity>

        {showFollow && (
          <TouchableOpacity
            onPress={localRequested ? onPressCancelRequestHandler : onPressFollowHandler}
            disabled={isLoading || localFollowed}
            className={`border-2 border-white rounded-lg px-3 py-1
              ${isLoading || localFollowed ? "opacity-60" : "opacity-100"}`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-1">
              {localFollowed ? (
                <>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text className="text-white font-semibold">Following</Text>
                </>
              ) : localRequested ? (
                <>
                  <Text className="text-white font-semibold">
                    {isCancellingRequest ? "Cancelling..." : "Requested"}
                  </Text>
                </>
              ) : isLoading ? (
                <Text className="text-white font-semibold">Sending…</Text>
              ) : (
                <Text className="text-white font-semibold">Follow</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {!!description && (
        <Text className="text-white text-sm mt-1" numberOfLines={2}>
          {description}
        </Text>
      )}
    </View>
  );
};
