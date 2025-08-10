import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetMemoryCommentsQuery } from "../../lib/APIs/RTKQuery/InteractionApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddComment } from "./AddComment";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  memoryId: string;
  isVisible: boolean;
  onClose: () => void;
};



export const CommentSection: React.FC<Props> = ({
  memoryId,
  isVisible,
  onClose,
}) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [backdropOpacity] = useState(new Animated.Value(0));

  const { data: comments, isLoading, refetch } = useGetMemoryCommentsQuery(memoryId);

  useEffect(() => {
    const animations = [
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isVisible ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [isVisible, slideAnim, backdropOpacity]);



  const formatTimeAgo = (dateString: string) => {
    const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    
    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const renderComment = ({ item }: { item: any }) => {
    const username = item.username || `User${item.userId.slice(0, 4)}`;
    const avatarInitial = username.charAt(0).toUpperCase();
    
    return (
      <View className="flex-row items-start space-x-3 px-4 py-3">
        <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
          <Text className="text-gray-600 font-semibold text-sm">{avatarInitial}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-semibold text-sm">{username}</Text>
            <Text className="text-gray-400 text-xs">
              {formatTimeAgo(item.created_at || new Date().toISOString())}
            </Text>
          </View>
          <Text className="text-white text-sm mt-1 leading-5">{item.content}</Text>
        </View>
        <TouchableOpacity className="p-2">
          <Ionicons name="heart-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        className="absolute left-0 right-0 bg-gray-900 rounded-t-3xl"
        style={{
          transform: [{ translateY: slideAnim }],
          bottom: 43, 
          maxHeight: (screenHeight - 43) * 0.8, 
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-700">
            <Text className="text-white font-semibold text-lg">Comments</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments || []}
            renderItem={renderComment}
            keyExtractor={(item: any) => item.id}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Text className="text-gray-400">
                  {isLoading ? "Loading comments..." : "No comments yet"}
                </Text>
              </View>
            }
          />

         <AddComment memoryId={memoryId} refetch={refetch} />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}; 