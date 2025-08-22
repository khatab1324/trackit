import React, { useState } from 'react'
import { Platform, View, Text, Keyboard } from 'react-native'
import { KeyboardAvoidingView, TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAddCommentMutation } from '../../lib/APIs/RTKQuery/InteractionApi'

export const AddComment = ({memoryId, refetch}: {memoryId: string, refetch: () => void}) => {
    const [commentText, setCommentText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
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
      Keyboard.dismiss();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <View className="border-t border-gray-800 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="px-4 py-3"
      >
        <View className="flex-row items-end space-x-3 gap-2">
          <View 
            className={`flex-1 bg-gray-800 rounded-2xl  px-4 border-2 ${
              isFocused ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor="#9CA3AF"
              className="text-white text-base min-h-[20px] max-h-[80px]"
              multiline
              maxLength={200}
              textAlignVertical="center"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              underlineColorAndroid="transparent"
              editable={!isAddingComment}
              onKeyPress={handleKeyPress}
              style={{ lineHeight: 20 }}
            />
          </View>
          
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || isAddingComment}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              commentText.trim() && !isAddingComment
                ? "bg-blue-500"
                : "bg-gray-700"
            }`}
            activeOpacity={0.8}
          >
            {isAddingComment ? (
              <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Ionicons 
                name="send" 
                size={20} 
                color={commentText.trim() && !isAddingComment ? "white" : "#9CA3AF"} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Character Count */}
        {commentText.length > 0 && (
          <View className="mt-2 flex-row justify-end px-1">
            <Text 
              className={`text-xs font-medium ${
                commentText.length > 180 ? "text-red-400" : "text-gray-500"
              }`}
            >
              {commentText.length}/200
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  )
}
