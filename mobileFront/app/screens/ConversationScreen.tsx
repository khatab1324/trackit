import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { connectSocket } from "../services/socket";

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

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [canRefetch, setCanRefetch] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId =
    currentUser && "id" in currentUser ? (currentUser as any).id : undefined;

  const {
    chatData,
    isChatLoading,
    isConnected,
    messages,
    sendMessage: sendMessageHook,
    refetchChat,
  } = useChatWithFriend(friendId);

  useEffect(() => {
    
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Set canRefetch when chatData is available
  useEffect(() => {
    if (friendId && chatData && !canRefetch) {
      console.log("Chat data available, enabling refetch for friendId:", friendId);
      setCanRefetch(true);
    }
  }, [friendId, chatData, canRefetch]);

  // Refetch chat data when the screen opens and refetch is ready
  useEffect(() => {
    if (friendId && canRefetch) {
      console.log("ConversationScreen opened, refetching chat data for friendId:", friendId);
      // Don't auto-refetch immediately, let user pull to refresh if needed
      // This prevents the "Cannot refetch a query that has not been started yet" error
    }
  }, [friendId, canRefetch]);

  const onRefresh = async () => {
    if (!canRefetch) {
      setRefreshing(false);
      return;
    }
    
    setRefreshing(true);
    try {
      await refetchChat();
    } catch (error) {
      console.error("Error refreshing chat:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !isChatLoading) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      });
    }
  }, [messages, isChatLoading]);

  const sendMessage = async () => {
    if (newMessage.trim() && chatData && isConnected && !sending) {
      setSending(true);
      try {
        await sendMessageHook(newMessage.trim());
        setNewMessage("");
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        });
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSending(false);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUserId;

    return (
      <View className={`mb-3 ${isOwnMessage ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
            isOwnMessage
              ? "bg-blue-600 dark:bg-blue-700 rounded-br-md"
              : "bg-gray-200 dark:bg-gray-700 rounded-bl-md"
          }`}
        >
          <Text
            className={`text-sm ${
              isOwnMessage ? "text-white" : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {item.message}
          </Text>
          {!!item.media_link && (
            <Text
              className={`text-xs mt-1 ${
                isOwnMessage ? "text-blue-100" : "text-blue-400"
              }`}
            >
              📎 Media attached
            </Text>
          )}
        </View>
        <Text
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {new Date(item.create_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (isChatLoading && !chatData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">
          Loading conversation...
        </Text>
      </SafeAreaView>
    );
  }

  const keyboardOffset = Platform.select({ ios: headerHeight, android: 0 });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View
          className="flex-row items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900"
          style={{
            height: headerHeight,
            transform: [{ translateY: keyboardVisible ? 6 : 0 }],
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-blue-500 text-lg">← Back</Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text
              className="text-lg font-semibold text-gray-800 dark:text-white"
              numberOfLines={1}
            >
              {friendName || `Chat with ${friendId}`}
            </Text>
            {!isConnected && (
              <Text className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Connecting...
              </Text>
            )}
          </View>
          <View className="w-8" />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 16,
            flexGrow: 1,
            justifyContent: messages.length === 0 ? "center" : "flex-end",
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
              enabled={canRefetch}
            />
          }
          ListEmptyComponent={
            !isChatLoading ? (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 dark:text-gray-400 text-center text-lg">
                  No messages yet
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-2">
                  Start the conversation by sending a message!
                </Text>
                {!canRefetch && (
                  <Text className="text-gray-400 dark:text-gray-500 text-center text-xs mt-4">
                    Pull down to refresh when ready
                  </Text>
                )}
              </View>
            ) : null
          }
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

        <View
          className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 py-2"
          style={{
            paddingBottom:
              Platform.OS === "ios"
                ? keyboardVisible
                  ? 0
                  : insets.bottom
                : 0,
          }}
        >
          <View className="flex-row items-end">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 text-gray-800 dark:text-white"
              multiline
              maxLength={500}
              textAlignVertical="center"
              onFocus={() =>
                setTimeout(
                  () => flatListRef.current?.scrollToEnd({ animated: true }),
                  100
                )
              }
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim() || !isConnected || sending}
              className={`ml-3 px-6 py-3 rounded-full ${
                newMessage.trim() && isConnected && !sending
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  className={`font-semibold ${
                    newMessage.trim() && isConnected && !sending
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  Send
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {!isConnected && (
            <View className="mt-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-lg">
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#D97706" className="mr-2" />
                <Text className="text-yellow-800 dark:text-yellow-200 text-center">
                  Connecting to chat...
                </Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
