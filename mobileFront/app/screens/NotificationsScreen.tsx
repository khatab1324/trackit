import React, { useEffect, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useGetNotificationsQuery } from "../lib/APIs/RTKQuery/notificationsApi";
import { NotificationItem } from "../components/notifications/NotificationItem";
import { NotificationItemData } from "../components/notifications/types";
import { useGetFollowRequestsQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const themeColors = isDark ? colors.dark : colors.light;

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
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: themeColors.border }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: themeColors.text }}>Notifications</Text>
      </View>

      {isLoadingNotifications || isLoadingFollowRequests ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: themeColors.secondaryText }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: themeColors.border, marginHorizontal: 16 }} />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isFetching || isLoadingFollowRequests}
          ListEmptyComponent={
            <View style={{ paddingVertical: 64, alignItems: "center" }}>
              <Text style={{ color: themeColors.secondaryText }}>
                {isError && "No notifications at the moment"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
