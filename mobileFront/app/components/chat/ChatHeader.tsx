import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";

type ChatHeaderProps = {
  friendName: string;
  friendAvatar?: string;
  isOnline?: boolean;
  isConnected: boolean;
  onMoreOptions?: () => void;
  headerHeight: number;
  keyboardVisible: boolean;
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  friendName,
  friendAvatar,
  isOnline = false,
  isConnected,
  headerHeight,
  keyboardVisible,
}) => {
  const navigation = useNavigation();
  const isDark = useAppSelector((state: RootState) => state.sheardDataThrowApp.darkMode);

  return (
    <View
      className={clsx(
        "flex-row  justify-between px-6 py-12",
        isDark ? "bg-neutral-900 border-b border-neutral-700/50" : "bg-white/90 border-b border-gray-200/50",
        "backdrop-blur-lg"
      )}
      style={{
        height: headerHeight,
        transform: [{ translateY: keyboardVisible ? 6 : 0 }],
      }}
    >
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-full items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>
      <TouchableOpacity 
        className="flex-1 items-center mx-4"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <View className="relative mr-3">
            <Image
              source={
                friendAvatar
                  ? { uri: friendAvatar }
                  : { uri: "https://via.placeholder.com/40x40" }
              }
              className="w-10 h-10 rounded-full"
            />
            {isOnline && (
              <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900" />
            )}
          </View>
          
          <View className="items-center">
            <Text
              className="text-lg font-bold text-gray-800 dark:text-white"
              numberOfLines={1}
            >
              {friendName}
            </Text>
            
            {!isConnected && (
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" />
                <Text className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  Connecting...
                </Text>
              </View>
            )}
            
            {isConnected && isOnline && (
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Online
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      

    </View>
  );
};

export default ChatHeader; 