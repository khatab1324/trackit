// app/screens/NotificationsScreen.tsx
import React, { useEffect, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useGetNotificationsQuery } from "../lib/APIs/RTKQuery/notificationsApi";
import { NotificationItem, NotificationItemData } from "../components/notifications/NotificationItem";

const MOCK: NotificationItemData[] = [
  {
    id: "1",
    type: "FOLLOW_REQUEST",
    actor: { user_id: "u1", username: "mona" },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5m
    is_read: false,
  },
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

  const items = useMemo(() => {
    if (data?.data && data.data.length > 0) return data.data as any[];
    if (isError || !data) return MOCK;
    return [];
  }, [data, isError]);

  useEffect(() => {
    const unreadFromApi =
      typeof data?.unreadCount === "number" ? data.unreadCount : undefined;
    const unread =
      unreadFromApi ?? MOCK.filter((n) => !n.is_read).length;  
    dispatch(setUnreadCount(unread));
  }, [data?.unreadCount, dispatch]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xl font-bold text-black dark:text-white">
          Notifications
        </Text>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-300">Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <NotificationItem item={item as any} />}
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
                لا توجد إشعارات حالياً
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
