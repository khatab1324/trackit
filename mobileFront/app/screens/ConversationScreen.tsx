import React, { useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";
import { Ionicons } from "@expo/vector-icons";

export const ConversationScreen = () => {
  const route = useRoute<any>();
  const { conversationId, username } = route.params;
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

  // بيانات محادثة تجريبية
  const [messages, setMessages] = useState([
    { id: "1", content: "Hello!", isMine: false },
    { id: "2", content: "Hi, how are you?", isMine: true },
  ]);

  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    const newMessage = { id: Date.now().toString(), content: text.trim(), isMine: true };
    setMessages((prev) => [...prev, newMessage]);
    setText("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: themeColors.border }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: themeColors.text }}>{username}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.isMine ? "flex-end" : "flex-start",
                backgroundColor: item.isMine ? themeColors.primary : themeColors.secondary,
                borderRadius: 16,
                padding: 10,
                marginVertical: 4,
                marginHorizontal: 8,
                maxWidth: "80%",
              }}
            >
              <Text style={{ color: item.isMine ? "#fff" : themeColors.text }}>{item.content}</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderTopWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: themeColors.secondary,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              color: themeColors.text,
            }}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.secondaryText}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handleSend} style={{ marginLeft: 8 }}>
            <Ionicons name="send" size={22} color={themeColors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationScreen;
