import React, { useState, useRef, useEffect } from "react";
import {
  View,
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
import { colors } from "../core/theme/colors";
import { ThemedText } from "../components/ThemedText";

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

  const theme = useSelector((state: RootState) => state.theme.current);
  const themeColors = colors[theme];

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
              ? "bg-primary rounded-br-md"
              : "bg-card rounded-bl-md"
          }`}
        >
          <ThemedText
            className={`text-sm ${
              isOwnMessage ? "text-white" : "text-text"
            }`}
          >
            {item.message}
          </ThemedText>
        </View>
        <ThemedText
          type="placeholder"
          className={`text-xs mt-1`}
        >
          {new Date(item.create_at).toLocaleTimeString()}
        </ThemedText>
      </View>
    );
  };

  const keyboardOffset = Platform.select({ ios: headerHeight, android: 0 });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View
          className="flex-row items-center justify-between px-4 border-b border-border bg-card"
          style={{ height: headerHeight }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <ThemedText className="text-lg font-semibold" numberOfLines={1}>
              {friendName || `Chat with ${friendId}`}
            </ThemedText>
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

        <View className="border-t border-border bg-card px-4 py-2">
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={themeColors.placeholder}
              className="flex-1 bg-secondary rounded-full px-4 py-3 text-text"
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim() || !isConnected || sending}
              className={`ml-3 p-3 rounded-full ${
                newMessage.trim() && isConnected && !sending
                  ? "bg-primary"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color={themeColors.text} />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    newMessage.trim() && isConnected && !sending
                      ? themeColors.text
                      : themeColors.placeholder
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
