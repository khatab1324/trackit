import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMakeFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";

export const UserMemo = ({
  username,
  description,
  userId,
  currentUserId,
}: {
  username: string;
  description?: string;
  userId: string;
  currentUserId?: string;
}) => {
  const [makeFollowRequest, { isLoading }] = useMakeFollowRequestMutation();
  const [requested, setRequested] = useState(false);

  const onPressFollowHandler = async () => {
    if (isLoading || requested) return;
    try {
      await makeFollowRequest({ toUserId: userId }).unwrap();
      setRequested(true);
    } catch (e) {
      console.log("Follow request failed", e);
    }
  };

  const showFollow = currentUserId ? currentUserId !== userId : true;

  return (
    <View className="absolute left-3 right-20 bottom-24">
      <View className="flex-row items-center gap-2 pb-2">
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-white font-semibold">@{username}</Text>
        </TouchableOpacity>

        {showFollow && (
          <TouchableOpacity
            onPress={onPressFollowHandler}
            disabled={isLoading || requested}
            className={`border-2 border-white rounded-lg px-3 py-1
              ${isLoading || requested ? "opacity-60" : "opacity-100"}`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-1">
              {requested ? (
                <>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text className="text-white font-semibold">Requested</Text>
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
