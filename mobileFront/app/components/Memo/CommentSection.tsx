import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Keyboard,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetMemoryCommentsQuery, useLikeCommentMutation, useUnlikeCommentMutation, useDeleteCommentMutation, useEditCommentMutation } from "../../lib/APIs/RTKQuery/InteractionApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddComment } from "./AddComment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/HomeStack";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  memoryId: string;
  isVisible: boolean;
  onClose: () => void;
  onNavigateToProfile?: (userId: string) => void;
};

export const CommentSection: React.FC<Props> = ({
  memoryId,
  isVisible,
  onClose,
  onNavigateToProfile,
}) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = (currentUser as any)?.id || (currentUser as any)?.user_id;
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {
    data: comments,
    isLoading,
    error,
    refetch,
  } = useGetMemoryCommentsQuery(memoryId, {
    skip: !isVisible, // Only fetch when comment section is visible
  });

  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [editComment] = useEditCommentMutation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    const animations = [
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isVisible ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [isVisible, slideAnim, backdropOpacity]);

  const handleRefresh = () => {
    refetch();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      setLikingCommentId(commentId);
      await likeComment({ comment_id: commentId }).unwrap();
    } catch (error) {
      console.error("Failed to like comment:", error);
    } finally {
      setLikingCommentId(null);
    }
  };

  const handleUnlikeComment = async (commentId: string) => {
    try {
      setLikingCommentId(commentId);
      await unlikeComment({ comment_id: commentId }).unwrap();
    } catch (error) {
      console.error("Failed to unlike comment:", error);
    } finally {
      setLikingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment({ comment_id: commentId }).unwrap();
            } catch (error) {
              console.error("Failed to delete comment:", error);
            }
          },
        },
      ]
    );
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await editComment({ comment_id: commentId, content: newContent }).unwrap();
      setEditingCommentId(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const formatTimeAgo = (dateString: string) => {
    const diffInSeconds = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000
    );

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const renderComment = ({ item }: { item: any }) => {
    const username = item.username || `User${item.userId?.slice(0, 4) || 'Unknown'}`;
    const avatarInitial = username.charAt(0).toUpperCase();
    const isOwner = item.userId === currentUserId;
    const isEditing = editingCommentId === item.id;

    return (
      <View className="px-4 py-4 border-b border-gray-800/30">
        <View className="flex-row items-start">
          {/* Avatar */}
          <View className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center mr-3">
            <Text className="text-white font-bold text-base">
              {avatarInitial}
            </Text>
          </View>
          
          {/* Comment Content */}
          <View className="flex-1">
            {/* Header with username and time */}
            <View className="flex-row items-center mb-2">
              <TouchableOpacity 
                onPress={() => {
                  console.log("Username clicked! item:", item);
                  console.log("userId from item:", item.userId);
                  
                  if (item.userId) {
                    if (onNavigateToProfile) {
                      console.log("Using onNavigateToProfile callback for userId:", item.userId);
                      onNavigateToProfile(item.userId);
                    } else {
                      console.log("No onNavigateToProfile callback available, trying direct navigation");
                      try {
                        navigation.navigate("Profile", { userId: item.userId });
                        console.log("Direct navigation completed");
                      } catch (error) {
                        console.error("Direct navigation failed:", error);
                      }
                    }
                  } else {
                    console.warn("No userId available for navigation");
                  }
                }}
                className="mr-2"
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-base">
                  {username}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-400 text-xs">
                {formatTimeAgo(item.created_at || new Date().toISOString())}
              </Text>
            </View>
            
            {/* Comment Text or Edit Input with Like Button */}
            {isEditing ? (
              <View className="mb-3">
                <TextInput
                  value={editText}
                  onChangeText={setEditText}
                  className="bg-gray-800 text-white text-base px-3 py-2 rounded-lg"
                  multiline
                  maxLength={200}
                />
                <View className="flex-row gap-x-2 mt-2">
                  <TouchableOpacity
                    onPress={() => handleEditComment(item.id, editText)}
                    className="bg-blue-500 px-3 py-1 rounded-lg"
                  >
                    <Text className="text-white text-sm font-medium">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelEditing}
                    className="bg-gray-600 px-3 py-1 rounded-lg"
                  >
                    <Text className="text-white text-sm font-medium">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row items-start justify-between mb-3">
                <Text className="text-gray-200 text-base leading-6 flex-1 mr-4 pr-2">
                  {item.content}
                </Text>
                
                {/* Like Button beside the comment text */}
                <TouchableOpacity
                  onPress={() => 
                    item.isLiked 
                      ? handleUnlikeComment(item.id)
                      : handleLikeComment(item.id)
                  }
                  disabled={likingCommentId === item.id}
                  className={`flex-row items-center space-x-1 px-3 py-2 rounded-full ${
                    likingCommentId === item.id 
                      ? 'bg-gray-700/70 opacity-60' 
                      : 'bg-gray-800/50 hover:bg-gray-700/70'
                  }`}
                  activeOpacity={0.7}
                >
                  {likingCommentId === item.id ? (
                    <View className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Ionicons 
                      name={item.isLiked ? "heart" : "heart-outline"} 
                      size={18} 
                      color={item.isLiked ? "#EF4444" : "#9CA3AF"} 
                    />
                  )}
                  <Text className="text-gray-300 text-sm ml-1 font-medium">
                    {item.likeCount || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Owner Actions */}
            {isOwner && (
              <View className="flex-row gap-x-4">
                <TouchableOpacity
                  onPress={() => startEditing(item)}
                  className="flex-row items-center space-x-1"
                >
                  <Text className="text-gray-400 text-sm">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteComment(item.id)}
                  className="flex-row items-center space-x-1"
                >
                  <Text className="text-red-400 text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        className="absolute left-0 right-0 bg-gray-900 rounded-t-3xl"
        style={{
          transform: [{ translateY: slideAnim }],
          bottom: Math.max(43, keyboardHeight),
          maxHeight: (screenHeight - 43) * 0.85,
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          {/* Drag Handle */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-gray-600 rounded-full" />
          </View>
          
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-800">
            <Text className="text-white font-bold text-xl">Comments</Text>
            <TouchableOpacity 
              onPress={handleClose} 
              className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <FlatList
            data={comments || []}
            renderItem={renderComment}
            keyExtractor={(item: any) => item.id}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={handleRefresh}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={
              comments && comments.length > 0 ? (
                <View className="px-4 py-3 border-b border-gray-800">
                  <Text className="text-gray-400 text-sm font-medium">
                    {comments.length} comment{comments.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View className="py-20 items-center">
                <View className="w-16 h-16 rounded-full bg-gray-800 items-center justify-center mb-4">
                  <Ionicons name="chatbubble-outline" size={32} color="#6B7280" />
                </View>
                <Text className="text-gray-400 text-lg font-medium mb-2">
                  {isLoading ? "Loading comments..." : "No comments yet"}
                </Text>
                <Text className="text-gray-500 text-center px-8">
                  {isLoading ? "Please wait..." : "Be the first to share your thoughts!"}
                </Text>
              </View>
            }
          />

          {/* Add Comment Input */}
          <AddComment memoryId={memoryId} refetch={handleRefresh} />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};
