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
  Modal,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { ChatBubble } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatHeader } from "../components/chat/ChatHeader";
import clsx from "clsx";

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
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
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
    editMessage: editMessageHook,
    deleteMessage: deleteMessageHook,
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

  useEffect(() => {
    if (friendId && chatData && !canRefetch) {
      console.log("Chat data available, enabling refetch for friendId:", friendId);
      setCanRefetch(true);
    }
  }, [friendId, chatData, canRefetch]);

  useEffect(() => {
    if (friendId && canRefetch) {
      console.log("ConversationScreen opened, refetching chat data for friendId:", friendId);
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

  const handleMessageLongPress = (message: Message) => {
    if (message.sender_id === currentUserId) {
      setSelectedMessage(message);
      setShowMessageOptions(true);
    }
  };

  const handleEditMessage = () => {
    if (selectedMessage) {
      setEditingMessage(selectedMessage);
      setEditText(selectedMessage.message);
      setShowMessageOptions(false);
      setShowEditModal(true);
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      Alert.alert(
        "Delete Message",
        "Are you sure you want to delete this message?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                console.log("Deleting message:", selectedMessage.id);
                deleteMessageHook(selectedMessage.id);
                setShowMessageOptions(false);
                setSelectedMessage(null);
              } catch (error) {
                console.error("Error deleting message:", error);
              }
            },
          },
        ]
      );
    }
  };

  const handleSaveEdit = async () => {
    if (editingMessage && editText.trim() && editText !== editingMessage.message) {
      try {
        editMessageHook(editingMessage.id, editText.trim());
        setEditingMessage(null);
        setEditText("");
        setShowEditModal(false);
      } catch (error) {
        console.error("Error editing message:", error);
      }
    } else {
      setEditingMessage(null);
      setEditText("");
      setShowEditModal(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
    setShowEditModal(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUserId;
    const timestamp = new Date(item.create_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <ChatBubble
        message={item.message}
        timestamp={timestamp}
        isOwnMessage={isOwnMessage}
        hasMedia={!!item.media_link}
        onLongPress={() => handleMessageLongPress(item)}
      />
    );
  };

  if (isChatLoading && !chatData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        <Text className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-2">
          Loading conversation...
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-500">
          Please wait a moment
        </Text>
      </SafeAreaView>
    );
  }

  const keyboardOffset = Platform.select({ ios: headerHeight, android: 0 });

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ChatHeader
          friendName={friendName || `Chat with ${friendId}`}
          isConnected={isConnected}
          headerHeight={headerHeight}
          keyboardVisible={keyboardVisible}
          onMoreOptions={() => {}}
        />
       <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-2 pt-4"
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
              <View className="flex-1 justify-center items-center py-20 px-8">
                <View className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full items-center justify-center mb-4">
                  <Text className="text-4xl">💬</Text>
                </View>
                <Text className="text-xl font-bold text-gray-700 dark:text-gray-300 text-center mb-2">
                  No messages yet
                </Text>
                <Text className="text-gray-500 dark:text-gray-500 text-center text-base">
                  Start the conversation by sending a message!
                </Text>
                {!canRefetch && (
                  <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-4">
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

        {/* Message Input */}
        <ChatInput
          value={newMessage}
          onChangeText={setNewMessage}
          onSend={sendMessage}
          disabled={false}
          sending={sending}
          isConnected={isConnected}
        />
      </KeyboardAvoidingView>

      {/* Message Options Modal */}
      <Modal
        visible={showMessageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMessageOptions(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowMessageOptions(false)}
        >
          <View className="flex-1 justify-center items-center gap-x-4">
            <View className="bg-white dark:bg-neutral-800 rounded-3xl p-6 mx-4 min-w-[280px] shadow-2xl dark:shadow-neutral-900/50 border border-gray-200 dark:border-neutral-700">
              <Text className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                Message Options
              </Text>
              
              <TouchableOpacity
                onPress={handleEditMessage}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl py-4 mb-4 active:bg-blue-100 dark:active:bg-blue-900/30"
              >
                <Text className="text-blue-700 dark:text-blue-300 text-center font-semibold text-base">
                  Edit Message
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleDeleteMessage}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl py-4 active:bg-red-100 dark:active:bg-red-900/30"
              >
                <Text className="text-red-700 dark:text-red-300 text-center font-semibold text-base">
                  Delete Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Message Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowEditModal(false)}
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-white dark:bg-neutral-800 rounded-3xl p-6 mx-4 min-w-[320px] shadow-2xl dark:shadow-neutral-900/50 border border-gray-200 dark:border-neutral-700">
              <Text className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                Edit Message
              </Text>
              
              <TextInput
                value={editText}
                onChangeText={setEditText}
                className="bg-gray-100 dark:bg-neutral-700 rounded-2xl px-4 py-4 text-gray-800 dark:text-white text-base mb-6 border border-gray-200 dark:border-neutral-600"
                multiline
                autoFocus
                placeholder="Edit your message..."
                placeholderTextColor="#9CA3AF"
                maxLength={500}
              />
              
              <View className="flex-row gap-x-3">
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-2xl py-4 active:bg-gray-200 dark:active:bg-neutral-600"
                >
                  <Text className="text-gray-700 dark:text-gray-300 text-center font-semibold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl py-4 active:bg-blue-100 dark:active:bg-blue-900/30"
                >
                  <Text className="text-blue-700 dark:text-blue-300 text-center font-semibold text-base">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
