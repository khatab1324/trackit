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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

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
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId =
    currentUser && "id" in currentUser ? (currentUser as any).id : undefined;

  const {
    messages,
    isConnected,
    sendMessage: sendMessageHook,
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

  const sendMessage = async () => {
    if (newMessage.trim() && isConnected && !sending) {
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
          style={{ height: headerHeight }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white" numberOfLines={1}>
              {friendName || `Chat with ${friendId}`}
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Messages */}
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
        />

        <View className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 py-2">
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 text-gray-800 dark:text-white"
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim() || !isConnected || sending}
              className={`ml-3 p-3 rounded-full ${
                newMessage.trim() && isConnected && !sending
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="send"  
                  size={20}
                  color={
                    newMessage.trim() && isConnected && !sending
                      ? "#FFFFFF"
                      : "#9CA3AF"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
