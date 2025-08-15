import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

export const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

  // بيانات تجريبية
  const [conversations] = useState([
    { id: "1", username: "Ahmad", last_message: "How are you?", last_message_at: "2025-08-14T12:00:00Z" },
    { id: "2", username: "Sara", last_message: "See you tomorrow!", last_message_at: "2025-08-14T11:30:00Z" },
  ]);

  const goToConversation = (id: string, username: string) => {
    navigation.navigate("Conversation", { conversationId: id, username });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: themeColors.border }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: themeColors.text }}>Chats</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderColor: themeColors.border,
            }}
            onPress={() => goToConversation(item.id, item.username)}
          >
            <Text style={{ color: themeColors.text, fontWeight: "bold", fontSize: 16 }}>
              {item.username}
            </Text>
            <Text style={{ color: themeColors.secondaryText, marginTop: 2 }} numberOfLines={1}>
              {item.last_message || "No messages yet"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ paddingVertical: 64, alignItems: "center" }}>
            <Text style={{ color: themeColors.secondaryText }}>No chats found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
