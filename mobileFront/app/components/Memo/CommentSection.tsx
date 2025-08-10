import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetMemoryCommentsQuery, useAddCommentMutation } from "../../lib/APIs/RTKQuery/InteractionApi";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  memoryId: string;
  isVisible: boolean;
  onClose: () => void;
};

// Extended Comment type that includes username for display
type CommentWithUsername = {
  id: string;
  content: string;
  userId: string;
  username: string;
  created_at: string;
};

export const CommentSection: React.FC<Props> = ({
  memoryId,
  isVisible,
  onClose,
}) => {
  const [commentText, setCommentText] = useState("");
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [backdropOpacity] = useState(new Animated.Value(0));

  const { data: comments, isLoading, refetch } = useGetMemoryCommentsQuery(memoryId);
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  useEffect(() => {
    if (isVisible) {
      // Slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, backdropOpacity]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isAddingComment) return;

    try {
      await addComment({
        memoryId,
        content: commentText.trim(),
      }).unwrap();
      setCommentText("");
      refetch(); // Refresh comments
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const renderComment = ({ item }: { item: any }) => (
    <View className="flex-row items-start space-x-3 px-4 py-3">
      <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
        <Text className="text-gray-600 font-semibold text-sm">
          {(item.username || `User${item.userId.slice(0, 4)}`).charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center space-x-2">
          <Text className="text-white font-semibold text-sm">
            {item.username || `User${item.userId.slice(0, 4)}`}
          </Text>
          <Text className="text-gray-400 text-xs">
            {formatTimeAgo(item.created_at || new Date().toISOString())}
          </Text>
        </View>
        <Text className="text-white text-sm mt-1 leading-5">
          {item.content}
        </Text>
      </View>
      <TouchableOpacity className="p-2">
        <Ionicons name="heart-outline" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Comment Section */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl"
        style={{
          transform: [{ translateY: slideAnim }],
          maxHeight: (screenHeight - 43) * 0.8, // Account for navbar height
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-700">
            <Text className="text-white font-semibold text-lg">Comments</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <FlatList
            data={comments || []}
            renderItem={renderComment}
            keyExtractor={(item: any) => item.id}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                {isLoading ? (
                  <Text className="text-gray-400">Loading comments...</Text>
                ) : (
                  <Text className="text-gray-400">No comments yet</Text>
                )}
              </View>
            }
          />

          {/* Comment Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="border-t border-gray-700 p-4"
          >
            <View className="flex-row items-center space-x-3">
              <View className="flex-1 bg-gray-800 rounded-full px-4 py-2">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Add a comment..."
                  placeholderTextColor="#9CA3AF"
                  className="text-white text-base"
                  multiline
                  maxLength={200}
                />
              </View>
              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || isAddingComment}
                className={`px-4 py-2 rounded-full ${
                  commentText.trim() && !isAddingComment
                    ? "bg-blue-500"
                    : "bg-gray-600"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    commentText.trim() && !isAddingComment
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {isAddingComment ? "..." : "Post"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}; 