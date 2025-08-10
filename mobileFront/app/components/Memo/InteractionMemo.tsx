import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useToggleMemoryLikeMutation, useCancelFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";

type Props = {
  memoryId: string;
  num_likes: number | string;
  num_comments: number | string;
  isLiked: boolean;
  isSaved: boolean;
  is_requested: boolean;
  targetUserId?: string;
  currentUserId?: string;
};

export const InteractionMemo: React.FC<Props> = ({
  memoryId,
  num_likes,
  num_comments,
  isLiked,
  isSaved,
  is_requested,
  targetUserId,
  currentUserId,
}) => {
  // local optimistic state
  const [liked, setLiked] = useState<boolean>(!!isLiked);
  const [saved, setSaved] = useState<boolean>(!!isSaved);
  const [localRequested, setLocalRequested] = useState(is_requested);

  const [toggleMemoryLike, { isLoading: isLikeLoading }] = useToggleMemoryLikeMutation();
  const [cancelFollowRequest, { isLoading: isCancellingRequest }] = useCancelFollowRequestMutation();

  const onPressLikeHandler = async () => {
    if (isLikeLoading) return;
    try {
      const result = await toggleMemoryLike({ memoryId }).unwrap();
      setLiked(result.result.isLiked);
    } catch (e) {
      console.log("Like failed", e);
    }
  };

  const onPressCancelRequestHandler = async () => {
    if (isCancellingRequest || !targetUserId) return;
    try {
      await cancelFollowRequest({ target_id: targetUserId }).unwrap();
      setLocalRequested(false);
    } catch (e) {
      console.log("Cancel follow request failed", e);
    }
  };

  const showFollowRequest = targetUserId && currentUserId && targetUserId !== currentUserId;

  return (
    <View className="absolute right-3 bottom-24 items-center gap-6">
      {/* Follow Request Indicator */}
      {showFollowRequest && localRequested && (
        <View className="flex-col items-center gap-2 mb-4">
          <TouchableOpacity
            onPress={onPressCancelRequestHandler}
            disabled={isCancellingRequest}
            className="bg-blue-500 rounded-full p-2"
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isCancellingRequest ? "hourglass" : "close-circle"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <Text className="text-blue-400 text-xs text-center">
            {isCancellingRequest ? "Cancelling..." : "Requested"}
          </Text>
        </View>
      )}

      {/* Like */}
      <View className="flex-col items-center gap-2">
        <TouchableOpacity
          onPress={onPressLikeHandler}
          disabled={isLikeLoading}
          className="bg-white rounded-full p-2"
          activeOpacity={0.8}
        >
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={24}
            color={liked ? "#ff4757" : "#000"}
          />
        </TouchableOpacity>
        <Text className="text-white text-xs">{num_likes}</Text>
      </View>

      {/* Comment */}
      <View className="flex-col items-center gap-2">
        <TouchableOpacity className="bg-white rounded-full p-2" activeOpacity={0.8}>
          <FontAwesome name="comment-o" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-white text-xs">{num_comments}</Text>
      </View>

      {/* Save */}
      <View className="flex-col items-center gap-2">
        <TouchableOpacity className="bg-white rounded-full p-2" activeOpacity={0.8}>
          <FontAwesome
            name={saved ? "bookmark" : "bookmark-o"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
