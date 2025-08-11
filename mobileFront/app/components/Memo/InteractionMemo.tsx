import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useToggleMemoryLikeMutation, useToggleBookmarkMutation, useGetUserBookmarksQuery } from "../../lib/APIs/RTKQuery/InteractionApi";

type Props = {
  memoryId: string;
  num_likes: number | string;
  num_comments: number | string;
  isLiked: boolean;
  isSaved: boolean;
  onCommentPress: () => void;
};

export const InteractionMemo: React.FC<Props> = ({
  memoryId,
  num_likes,
  num_comments,
  isLiked,
  isSaved,
  onCommentPress,
}) => {
  const [liked, setLiked] = useState<boolean>(!!isLiked);
  const [saved, setSaved] = useState<boolean>(!!isSaved);
  const [likeCount, setLikeCount] = useState<number>(Number(num_likes) || 0);

  const [toggleMemoryLike, { isLoading: isLikeLoading }] = useToggleMemoryLikeMutation();
  const [toggleBookmark, { isLoading: isSaveLoading }] = useToggleBookmarkMutation();
  
  // Get refetch function to refresh bookmarks data
  const { refetch: refetchBookmarks } = useGetUserBookmarksQuery();

  const onPressLikeHandler = async () => {
    if (isLikeLoading) return;
    try {
      const result = await toggleMemoryLike({ memoryId }).unwrap();
      setLiked(result.result.isLiked);
      result.result.isLiked ? setLikeCount(likeCount + 1) : setLikeCount(likeCount - 1);
    } catch (e) {
      setLiked(!liked);
      setLikeCount(likeCount);
      console.log("Like failed", e);
    }
  };

  const onPressSaveHandler = async () => {
    if (isSaveLoading) return;
    try {
      const result = await toggleBookmark({ memory_id: memoryId }).unwrap();
      setSaved(result.isBookmarked || false);
      
      // Refetch bookmarks data to update the saved tab
      refetchBookmarks();
    } catch (e) {
      console.log("Save failed", e);
      // Keep the current state if the API call fails
    }
  };

  const onPressCommentHandler = () => {
    onCommentPress();
  };

  return (
    <View className="absolute right-3 bottom-36 items-center gap-6">
      {/* Like */}
      <TouchableOpacity
        onPress={onPressLikeHandler}
        disabled={isLikeLoading}
        className="items-center"
        activeOpacity={0.7}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={40}
          color={liked ? "#ff3040" : "white"}
        />
        <Text className="text-white text-lg mt-1 font-medium">
          {likeCount}
        </Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        onPress={onPressCommentHandler}
        className="items-center"
        activeOpacity={0.7}
      >
        <Ionicons
          name="chatbubble-outline"
          size={40}
          color="white"
        />
        <Text className="text-white text-lg mt-1 font-medium">
          {num_comments}
        </Text>
      </TouchableOpacity>

      {/* Save */}
      <TouchableOpacity
        onPress={onPressSaveHandler}
        disabled={isSaveLoading}
        className="items-center"
        activeOpacity={0.7}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={40}
          color={saved ? "#ffd700" : "white"}
        />
        {isSaveLoading && (
          <View className="mt-1">
            <Text className="text-white text-xs">Saving...</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
