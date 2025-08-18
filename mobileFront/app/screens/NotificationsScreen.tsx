import React, { useEffect, useMemo } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useGetNotificationsQuery } from "../lib/APIs/RTKQuery/notificationsApi";
import { NotificationItem } from "../components/notifications/NotificationItem";
import { NotificationItemData } from "../components/notifications/types";
import { useGetFollowRequestsQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";
import { ThemedText } from "../components/ThemedText";

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.current);

  const { data: notificationsData, isLoading: isLoadingNotifications, isError, isFetching } =
    useGetNotificationsQuery(undefined, { refetchOnFocus: true });

  const { data: followRequests, isLoading: isLoadingFollowRequests, refetch: refetchFollowRequests } =
    useGetFollowRequestsQuery();

  const items: NotificationItemData[] = useMemo(() => {
    const combined: NotificationItemData[] = [];
    if (notificationsData?.data?.length) {
      combined.push(...(notificationsData.data as NotificationItemData[]));
    }
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
  }, [notificationsData?.data, followRequests]);

  useEffect(() => {
    let totalUnread = 0;
    if (typeof notificationsData?.unreadCount === "number") {
      totalUnread += notificationsData.unreadCount;
    }
    if (followRequests?.length) {
      totalUnread += followRequests.length;
    }
    dispatch(setUnreadCount(totalUnread));
  }, [notificationsData?.unreadCount, followRequests, dispatch]);

  const handleRefresh = () => {
    refetchFollowRequests();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border bg-card">
        <ThemedText className="text-xl font-bold">Notifications</ThemedText>
      </View>

      {isLoadingNotifications || isLoadingFollowRequests ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={theme === 'dark' ? colors.dark.text : colors.light.text} />
          <ThemedText type="placeholder" className="mt-2">Loading…</ThemedText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-border mx-4" />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isFetching || isLoadingFollowRequests}
          ListEmptyComponent={
            <View className="py-16 items-center">
              <ThemedText type="placeholder">
                {isError && "No notifications at the moment"}
              </ThemedText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
