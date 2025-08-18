import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useToggleMemoryLikeMutation,
  useToggleBookmarkMutation,
  useGetUserBookmarksQuery,
} from "../../lib/APIs/RTKQuery/InteractionApi";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "../../hooks/useThemeColors";

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

  const [toggleMemoryLike, { isLoading: isLikeLoading }] =
    useToggleMemoryLikeMutation();
  const [toggleBookmark, { isLoading: isSaveLoading }] =
    useToggleBookmarkMutation();

  const { refetch: refetchBookmarks } = useGetUserBookmarksQuery();
  const themeColors = useThemeColors();

  const onPressLikeHandler = async () => {
    if (isLikeLoading) return;
    try {
      const result = await toggleMemoryLike({ memoryId }).unwrap();
      setLiked(result.result.isLiked);
      result.result.isLiked
        ? setLikeCount(likeCount + 1)
        : setLikeCount(likeCount - 1);
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
          color={liked ? themeColors.icon.like : themeColors.icon.secondary}
        />
        <ThemedText className="text-lg mt-1 font-medium">{likeCount}</ThemedText>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        onPress={onPressCommentHandler}
        className="items-center"
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubble-outline" size={40} color={themeColors.icon.comment} />
        <ThemedText className="text-lg mt-1 font-medium">
          {num_comments}
        </ThemedText>
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
          color={saved ? "#1E90FF" : themeColors.icon.secondary}
        />
        {isSaveLoading && (
          <View className="mt-1">
            <ThemedText type="text" className="text-xs">Saving...</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
