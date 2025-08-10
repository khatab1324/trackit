import React, { useState }   from 'react'
import { Platform, View, Text } from 'react-native'
import { KeyboardAvoidingView, TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useAddCommentMutation } from '../../lib/APIs/RTKQuery/InteractionApi'

export const AddComment = ({memoryId, refetch}: {memoryId: string, refetch: () => void}) => {
    const [commentText, setCommentText] = useState('');
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isAddingComment) return;

    try {
      await addComment({
        memory_id: memoryId,
        content: commentText.trim(),
      }).unwrap();
      setCommentText("");
      refetch(); 
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  return (
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
  )
}
