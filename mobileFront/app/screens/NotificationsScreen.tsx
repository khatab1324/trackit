import React, { useEffect, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useGetNotificationsQuery } from "../lib/APIs/RTKQuery/notificationsApi";
import { NotificationItem } from "../components/notifications/NotificationItem";
import { NotificationItemData } from "../components/notifications/types";
import { useGetFollowRequestsQuery } from "../lib/APIs/RTKQuery/InteractionApi";

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const colorScheme = isDark ? colors.dark : colors.light;

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

    if (notificationsData?.data?.length) {
      combined.push(...(notificationsData.data as NotificationItemData[]));
    }

    if (followRequests?.length) {
      combined.push(
        ...followRequests.map((request) => {
          const req = request as { id: string; requester_id?: string; created_at?: string; username?: string };
          return {
            id: `follow-${req.id}`,
            type: "FOLLOW_REQUEST" as const,
            actor: {
              user_id: req.requester_id || "unknown",
              username: req.username ? req.username.slice(0, 10) : "Unknown User",
            },
            createdAt: req.created_at || new Date().toISOString(),
            is_read: false,
            request_id: req.id,
          };
        })
      );
    }

    return combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    refetch();
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: colorScheme.background }}
    >
      <View
        className="px-4 py-3 border-b"
        style={{ borderColor: colorScheme.border }}
      >
        <Text
          className="text-xl font-bold"
          style={{ color: colorScheme.text }}
        >
          Notifications
        </Text>
      </View>

      {isLoadingNotifications || isLoadingFollowRequests ? (
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colorScheme.secondaryText }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => (
            <View
              className="h-[1px] mx-4"
              style={{ backgroundColor: colorScheme.border }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isFetching || isLoadingFollowRequests}
          ListEmptyComponent={
            <View className="py-16 items-center">
              <Text style={{ color: colorScheme.secondaryText }}>
                {isError && "No notifications at the moment"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
