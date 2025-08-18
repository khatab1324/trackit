import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMakeFollowRequestMutation, useCancelFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";
import {  useMarkFollowRequested } from "../../core/hooks/useFollowRequest";
import { ThemedText } from "../ThemedText";

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
  const markRequested = useMarkFollowRequested();

  const onPressFollowHandler = async () => {
    if (isMakingRequest || localRequested || localFollowed) return;
    try {
      await makeFollowRequest({ target_id: userId }).unwrap();
      setLocalRequested(true);
      markRequested(userId, true);
    } catch (e) {
      console.log("Follow request failed", e);
    }
  };

  const onPressCancelRequestHandler = async () => {
    if (isCancellingRequest || !localRequested) return;
    try {
      await cancelFollowRequest({ target_id: userId }).unwrap();
      setLocalRequested(false);
      markRequested(userId, false);
    } catch (e) {
      console.log("Cancel follow request failed", e);
    }
  };
  useEffect(() => {
    setLocalRequested(isRequested);
  }, [isRequested]);

  const showFollow = currentUserId ? currentUserId !== userId : true;
  const isLoading = isMakingRequest || isCancellingRequest;

  return (
    <View className="absolute left-3 right-20 bottom-24">
      <View className="flex-row items-center gap-2 pb-2">
        <TouchableOpacity onPress={() => {}}>
          <ThemedText className="font-semibold">@{username}</ThemedText>
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
                  <ThemedText className="font-semibold">Following</ThemedText>
                </>
              ) : localRequested ? (
                <>
                  <ThemedText className="font-semibold">
                    {isCancellingRequest ? "Cancelling..." : "Requested"}
                  </ThemedText>
                </>
              ) : isLoading ? (
                <ThemedText className="font-semibold">Sending…</ThemedText>
              ) : (
                <ThemedText className="font-semibold">Follow</ThemedText>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {!!description && (
        <ThemedText className="text-sm mt-1" numberOfLines={2}>
          {description}
        </ThemedText>
      )}
    </View>
  );
};
