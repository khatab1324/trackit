// app/screens/NotificationsScreen.tsx
import React, { useEffect, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useGetNotificationsQuery } from "../lib/APIs/RTKQuery/notificationsApi";
import { NotificationItem } from "../components/notifications/NotificationItem";
import { NotificationItemData } from "../components/notifications/types";
import { useGetFollowRequestsQuery } from "../lib/APIs/RTKQuery/InteractionApi";

export default function NotificationsScreen() {
  const dispatch = useDispatch();

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    isError,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const {
    data: followRequests,
    isLoading: isLoadingFollowRequests,
    refetch: refetchFollowRequests,
  } = useGetFollowRequestsQuery();

  const items: NotificationItemData[] = useMemo(() => {
    const combined: NotificationItemData[] = [];

    // Add normal notifications from API
    if (notificationsData?.data?.length) {
      combined.push(...(notificationsData.data as NotificationItemData[]));
    }

    // Add follow request notifications
    if (followRequests?.length) {
      combined.push(
        ...followRequests.map((request) => ({
          id: `follow-${request.id}`,
          type: "FOLLOW_REQUEST" as const,
          actor: {
            user_id: request.requester_id || "unknown",
            username: request.username
              ? request.username.slice(0, 10)
              : "Unknown User",
          },
          createdAt: request.created_at || new Date().toISOString(),
          is_read: false,
          request_id: request.id,
        }))
      );
    }

    // Sort newest first
    return combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notificationsData?.data, followRequests]);

  // Update unread count in store
  useEffect(() => {
    let totalUnread = 0;

    if (typeof notificationsData?.unreadCount === "number") {
      totalUnread += notificationsData.unreadCount;
    }

    if (followRequests?.length) {
      totalUnread += followRequests.length; // treat all follow requests as unread
    }

    dispatch(setUnreadCount(totalUnread));
  }, [notificationsData?.unreadCount, followRequests, dispatch]);

  const handleRefresh = () => {
    refetchFollowRequests();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xl font-bold text-black dark:text-white">
          Notifications
        </Text>
      </View>

      {isLoadingNotifications || isLoadingFollowRequests ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-300">Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-gray-200 dark:bg-gray-800 mx-4" />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isFetching || isLoadingFollowRequests}
          ListEmptyComponent={
            <View className="py-16 items-center">
              <Text className="text-gray-500 dark:text-gray-300">
                {isError && "No notifications at the moment"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}