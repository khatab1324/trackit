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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useChatWithFriend } from "../hooks/useChatWithFriend";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

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

  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser && "id" in currentUser ? currentUser.id : undefined;

  const {
    chatData,
    isChatLoading,
    isConnected,
    messages,
    sendMessage: sendMessageHook,
  } = useChatWithFriend(friendId);

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
      setNewMessage("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUserId;
    return (
      <View style={{ marginBottom: 8, alignItems: isOwnMessage ? "flex-end" : "flex-start" }}>
        <View
          style={{
            maxWidth: "80%",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
            backgroundColor: isOwnMessage
              ? themeColors.primary
              : themeColors.secondary,
            borderBottomRightRadius: isOwnMessage ? 4 : 16,
            borderBottomLeftRadius: isOwnMessage ? 16 : 4,
          }}
        >
          <Text style={{ fontSize: 14, color: isOwnMessage ? themeColors.white : themeColors.text }}>
            {item.message}
          </Text>
          {item.media_link && (
            <Text style={{ fontSize: 12, marginTop: 4, color: themeColors.icon.primary }}>
              📎 Media attached
            </Text>
          )}
        </View>
        <Text style={{ fontSize: 10, marginTop: 4, color: themeColors.secondaryText }}>
          {new Date(item.create_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (isChatLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: themeColors.background }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ marginTop: 16, color: themeColors.secondaryText }}>Loading conversation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: themeColors.border,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: themeColors.primary, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "600", color: themeColors.text }}>
          {friendName || `Chat with ${friendId}`}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: themeColors.border,
          backgroundColor: themeColors.background,
        }}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.secondaryText}
            style={{
              flex: 1,
              backgroundColor: themeColors.secondary,
              color: themeColors.text,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
            multiline
            maxLength={500}
            textAlignVertical="center"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            style={{
              marginLeft: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 24,
              backgroundColor: newMessage.trim() && isConnected
                ? themeColors.primary
                : themeColors.border,
            }}
          >
            <Text style={{ color: newMessage.trim() && isConnected ? themeColors.white : themeColors.secondaryText }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Connection Status */}
      {!isConnected && (
        <View style={{
          position: "absolute",
          top: 80,
          left: 16,
          right: 16,
          backgroundColor: isDark ? "#854d0e" : "#fef9c3",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
        }}>
          <Text style={{ color: isDark ? "#fde68a" : "#92400e", textAlign: "center" }}>
            Connecting to chat...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
