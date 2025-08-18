import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type ChatBubbleProps = {
  message: string;
  timestamp: string;
  isOwnMessage: boolean;
  hasMedia?: boolean;
  onLongPress?: () => void;
  isTyping?: boolean;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  isOwnMessage,
  hasMedia = false,
  onLongPress,
  isTyping = false,
}) => {
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className={clsx(
        "mb-4 px-4",
        isOwnMessage ? "items-end" : "items-start"
      )}
    >
      <View
        className={clsx(
          "max-w-[80%] px-5 py-4 rounded-3xl",
          "shadow-sm",
          isDark ? "dark:shadow-neutral-900/50" : "",
          isOwnMessage
            ? (isDark ? "bg-white rounded-br-md" : "bg-slate-700 rounded-br-md")
            : (isDark
                ? "bg-neutral-800 border border-neutral-700 rounded-bl-md"
                : "bg-white border border-gray-100 rounded-bl-md")
        )}
      >
        {isTyping ? (
          <View className="flex-row items-center space-x-1">
            <View className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
            <View className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
            <View className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
          </View>
        ) : (
          <>
            <Text
              className={clsx(
                "text-base leading-5 font-medium",
                isDark
                  ? (isOwnMessage ? "text-gray-800" : "text-white")
                  : (isOwnMessage ? "text-white" : "text-gray-800")
              )}
            >
              {message}
            </Text>
            
            {hasMedia && (
              <View className="flex-row items-center mt-2">
                <Ionicons 
                  name="attach" 
                  size={16} 
                  color={isOwnMessage ? "#BFDBFE" : "#60A5FA"} 
                />
                <Text
                  className={clsx(
                    "text-xs ml-1 font-medium",
                    isOwnMessage ? "text-blue-100" : "text-blue-500 dark:text-blue-400"
                  )}
                >
                  Media attached
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      
      <Text
        className={clsx(
          "text-xs mt-2 px-1",
          isOwnMessage ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
        )}
      >
        {timestamp}
      </Text>
    </TouchableOpacity>
  );
};

export default ChatBubble; 