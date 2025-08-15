import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

export const ChatScreen = () => {
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const colorScheme = isDark ? colors.dark : colors.light;

  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: input }]);
    setInput("");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colorScheme.background }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text style={{ color: colorScheme.text }}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          borderTopWidth: 1,
          borderColor: colorScheme.border,
          backgroundColor: colorScheme.secondary,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colorScheme.secondaryText}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
            color: colorScheme.text,
            borderRadius: 20,
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: colorScheme.primary,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: colorScheme.white }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
