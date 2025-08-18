import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
  isConnected?: boolean;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  sending = false,
  isConnected = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-end space-x-3 gap-2">
        <View 
          className={clsx(
            "flex-1 bg-gray-100 dark:bg-neutral-800 rounded-2xl py-2 h-14 ",
            "border-2 border-transparent",
            isFocused && "border-blue-500 dark:border-blue-400"
          )}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="text-gray-800 dark:text-white text-base h-12 "
            multiline
            maxLength={500}
            textAlignVertical="center"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            underlineColorAndroid="transparent"
            editable={!disabled && isConnected}
          />
        </View>
        <TouchableOpacity
          onPress={onSend}
          disabled={!value.trim() || !isConnected || sending || disabled}
          className={clsx(
            "w-20 h-14 rounded-2xl items-center justify-center",
            "shadow-sm dark:shadow-neutral-900/50",
            value.trim() && isConnected && !sending && !disabled
              ? "bg-slate-400"
              : "bg-gray-300 dark:bg-neutral-700"
          )}
          activeOpacity={0.8}
        >
          {sending ? (
            <Text className="text-white text-xs font-medium">...</Text>
          ) : (
            <Ionicons 
              name="send" 
              size={20} 
              color={value.trim() && isConnected && !sending && !disabled ? "#000000" : "#9CA3AF"} 
            />
          )}
        </TouchableOpacity>
      </View>
      {!isConnected && (
        <View className="mt-3 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-3 rounded-2xl border border-yellow-200 dark:border-yellow-800">
          <View className="flex-row items-center justify-center">
            <View className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse" />
            <Text className="text-yellow-800 dark:text-yellow-200 text-center font-medium">
              Connecting to chat...
            </Text>
          </View>
        </View>
      )}

      {/* Character Count */}
      {value.length > 0 && (
        <View className="mt-2 flex-row justify-end">
          <Text 
            className={clsx(
              "text-xs font-medium",
              value.length > 450 ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {value.length}/500
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChatInput; 