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

const MOCK: NotificationItemData[] = [
 
  {
    id: "2",
    type: "LIKE",
    actor: { user_id: "u2", username: "ahmad" },
    memo: { id: "m1", content_url: "https://picsum.photos/200?1" },
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(), 
    is_read: false,
  },
  {
    id: "3",
    type: "COMMENT",
    actor: { user_id: "u3", username: "lina" },
    memo: { id: "m2", content_url: "https://picsum.photos/200?2" },
    comment_text: "Nice memo!",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), 
    is_read: true,
  },
  {
    id: "4",
    type: "FOLLOW_ACCEPTED",
    actor: { user_id: "u4", username: "sara" },
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), 
    is_read: true,
  },
];

export default function NotificationsScreen() {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetNotificationsQuery();
  const { data: followRequests, isLoading: isLoadingFollowRequests } = useGetFollowRequestsQuery();

  const items = (() => {
    let allItems: NotificationItemData[] = [];
    
    if (data?.data && data.data.length > 0) {
      allItems.push(...(data.data as NotificationItemData[]));
    }
    
      if (followRequests && followRequests.length > 0) {
        const followRequestNotifications: NotificationItemData[] = followRequests.map(request => ({
          id: `follow-${request.id}`,
          type: "FOLLOW_REQUEST" as const,
          actor: { 
            user_id: request.requester_id || 'unknown', 
            username: request.requester_id ? `User ${request.requester_id.slice(0, 8)}` : 'Unknown User'
          },
          createdAt: request.created_at || new Date().toISOString(),
          is_read: false,
          request_id: request.id,
        }));
        allItems.push(...followRequestNotifications);
      }
    
    if (allItems.length === 0 && (isError || !data)) {
      allItems = MOCK;
      if (followRequests && followRequests.length > 0) {
        const followRequestNotifications: NotificationItemData[] = followRequests.map(request => ({
          id: `follow-${request.id}`,
          type: "FOLLOW_REQUEST" as const,
          actor: { 
            user_id: request.requester_id || 'unknown', 
            username: request.requester_id ? `User ${request.requester_id.slice(0, 8)}` : 'Unknown User'
          },
          createdAt: request.created_at || new Date().toISOString(),
          is_read: false,
          request_id: request.id,
        }));
        allItems.push(...followRequestNotifications);
      }
    }
    
    return allItems.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  })();

  useEffect(() => {

    // TODO: what this shit code
    const unreadFromApi =
      typeof data?.unreadCount === "number" ? data.unreadCount : undefined;
    
    let totalUnread = 0;
    
    if (unreadFromApi !== undefined) {
      totalUnread = unreadFromApi;
    } else {
      // Count unread from mock data
      totalUnread = MOCK.filter((n) => !n.is_read).length;
    }
    
    // Add unread follow requests
    if (followRequests) {
      totalUnread += followRequests.length; // All follow requests are considered unread initially
    }
    
    dispatch(setUnreadCount(totalUnread));
  }, [data?.unreadCount, followRequests, dispatch]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xl font-bold text-black dark:text-white">
          Notifications
        </Text>
      </View>

      {(isLoading || isLoadingFollowRequests) && !data ? (
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
          onRefresh={refetch}
          refreshing={isFetching}
          ListEmptyComponent={
            <View className="py-16 items-center">
              <Text className="text-gray-500 dark:text-gray-300">
                No notifications at the moment
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
