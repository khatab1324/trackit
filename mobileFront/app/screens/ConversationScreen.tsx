import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useChatWithFriend } from '../hooks/useChatWithFriend';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

type RouteParams = {
  friendId: string;
  friendName?: string;
};

type Message = {
  id: string;
  message: string;
  sender_id: string;
  create_at: string;
  media_link?: string | null;
  chat_id: string;
};

export const ConversationScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { friendId, friendName } = route.params as RouteParams;
  
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Get current user ID from Redux store
  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser && 'id' in currentUser ? currentUser.id : undefined;

  // Use the custom hook with friendId
  const {
    chatData,
    isChatLoading,
    isConnected,
    messages,
    sendMessage: sendMessageHook,
  } = useChatWithFriend(friendId);

  // Auto-scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (messages.length > 0 && !isChatLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isChatLoading]);

  const sendMessage = () => {
    if (newMessage.trim() && chatData && isConnected) {
      sendMessageHook(newMessage.trim());
      setNewMessage('');
      // Scroll to bottom after sending message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUserId;
    
    return (
      <View className={`mb-3 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isOwnMessage 
            ? 'bg-blue-600 dark:bg-blue-700 rounded-br-md' 
            : 'bg-gray-200 dark:bg-gray-700 rounded-bl-md'
        }`}>
          <Text className={`text-sm ${
            isOwnMessage ? 'text-white' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {item.message}
          </Text>
          {item.media_link && (
            <Text className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-100' : 'text-blue-400'
            }`}>
              📎 Media attached
            </Text>
          )}
        </View>
        <Text className={`text-xs mt-1 ${
          isOwnMessage ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {new Date(item.create_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (isChatLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading conversation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800 dark:text-white">
          {friendName || `Chat with ${friendId}`}
        </Text>
        <View className="w-8" />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4 pt-4"
        inverted={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
        onLayout={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      {/* Message Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ backgroundColor: 'transparent' }}
      >
        <View className="flex-row items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 text-gray-800 dark:text-white"
            multiline
            maxLength={500}
            textAlignVertical="center"
            onFocus={() => {
              // Scroll to bottom when input is focused
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className={`ml-3 px-6 py-3 rounded-full ${
              newMessage.trim() && isConnected 
                ? 'bg-blue-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <Text className={`font-semibold ${
              newMessage.trim() && isConnected 
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Connection Status */}
      {!isConnected && (
        <View className="absolute top-20 left-4 right-4 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-lg">
          <Text className="text-yellow-800 dark:text-yellow-200 text-center">
            Connecting to chat...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}; 