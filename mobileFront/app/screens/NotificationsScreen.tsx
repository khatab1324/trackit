import React, { useEffect, useMemo } from "react";
import { View, FlatList, Text, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { NotificationItem } from "../components/notifications/NotificationItem";
import { NotificationItemData } from "../components/notifications/types";
import { useGetFollowRequestsQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";
import clsx from "clsx";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;
  const { data: followRequests, isLoading: isLoadingFollowRequests, refetch: refetchFollowRequests } =
    useGetFollowRequestsQuery();

  const items: NotificationItemData[] = useMemo(() => {
    const combined: NotificationItemData[] = [];
    if (followRequests?.length) {
      combined.push(
        ...followRequests.map((request) => ({
          id: `follow-${request.id}`,
          type: "FOLLOW_REQUEST" as const,
          actor: {
            user_id: request.requester_id || "unknown",
            username: request.username ? request.username.slice(0, 10) : "Unknown User",
          },
          createdAt: request.created_at || new Date().toISOString(),
          is_read: false,
          request_id: request.id,
        }))
      );
    }
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [followRequests]);

  useEffect(() => {
    let totalUnread = 0;

    if (followRequests?.length) {
      totalUnread += followRequests.length;
    }
    dispatch(setUnreadCount(totalUnread));
  }, [followRequests, dispatch]);

  const handleRefresh = () => {
    refetchFollowRequests();
  };

  const handleBackPress = () => {
    navigation.navigate("Home" as never);
  };

  return (
    <SafeAreaView 
      className={clsx(
        "flex-1",
        isDark ? "bg-black" : "bg-white"
      )}
    >
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#000000" : "#ffffff"}
      />
      
      {/* Modern Header */}
      <View className={clsx(
        "px-6 py-6 border-b",
        isDark ? "border-gray-800" : "border-gray-100"
      )}>
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={handleBackPress}
            className={clsx(
              "mr-4 p-2 rounded-full",
              isDark ? "bg-gray-800" : "bg-gray-100"
            )}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? "#ffffff" : "#000000"} 
            />
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text className={clsx(
              "text-3xl font-bold",
              isDark ? "text-white" : "text-black"
            )}>
              Notifications
            </Text>
            <Text className={clsx(
              "text-base mt-1",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Stay updated with your social world
            </Text>
          </View>
        </View>
      </View>

      {isLoadingFollowRequests ? (
        <View className="flex-1 justify-center items-center">
          <View className={clsx(
            "w-16 h-16 rounded-full items-center justify-center mb-4",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}>
            <View className={clsx(
              "w-8 h-8 rounded-full border-2 border-transparent",
              "border-t-blue-600 border-r-purple-600"
            )} />
          </View>
          <Text className={clsx(
            "text-lg font-medium",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Loading notifications...
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 12, paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isLoadingFollowRequests}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <View className={clsx(
                "w-24 h-24 rounded-full items-center justify-center mb-6",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}>
               
              </View>
              <Text className={clsx(
                "text-xl font-semibold mb-2",
                isDark ? "text-white" : "text-black"
              )}>
                All caught up!
              </Text>
              <Text className={clsx(
                "text-base text-center px-8",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                You're all up to date. New notifications will appear here when they arrive.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
