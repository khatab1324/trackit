import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TimeAgo } from "./TimeAgo";
import { FollowRequestActions } from "./FollowRequestActions";

export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPTED";

export type NotificationItemData = {
  id: string;
  type: NotificationType;
  actor: { user_id: string; username: string; avatar_url?: string };
  memo?: { id: string; content_url?: string };
  comment_text?: string;
  createdAt: string;
  is_read?: boolean;
};

export const NotificationItem = ({ item }: { item: NotificationItemData }) => {
  const navigation = useNavigation<any>();

  const goToProfile = () =>
    navigation.navigate("Profile", { userId: item.actor.user_id });

  const goToMemo = () =>
    item.memo?.id &&
    navigation.navigate("MemoryDetails", {
      memories: [{ id: item.memo.id, content_url: item.memo.content_url || "" }],
      startIndex: 0,
    });

  const avatar = item.actor.avatar_url;

  const rightThumb =
    (item.type === "LIKE" || item.type === "COMMENT") && item.memo?.content_url ? (
      <TouchableOpacity
        onPress={goToMemo}
        className="ml-3"
        activeOpacity={0.8}
        style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden" }}
      >
        <Image source={{ uri: item.memo.content_url }} style={{ width: "100%", height: "100%" }} />
      </TouchableOpacity>
    ) : null;

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-start">
        <TouchableOpacity onPress={goToProfile} activeOpacity={0.8}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
          ) : (
            <Ionicons name="person-circle" size={48} color="#9ca3af" />
          )}
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <Text className="text-black dark:text-white" style={{ lineHeight: 20 }} numberOfLines={3}>
            <Text className="font-semibold">{item.actor.username}</Text>{" "}
            {item.type === "COMMENT"
              ? `علّق: ${item.comment_text ?? ""}`
              : item.type === "LIKE"
              ? "أعجب بذكرياتك"
              : item.type === "FOLLOW_REQUEST"
              ? "طلب متابعتك"
              : "قبل طلب متابعتك"}
            {" · "}
            <TimeAgo iso={item.createdAt} />
          </Text>

          {item.type === "FOLLOW_REQUEST" && (
            <FollowRequestActions onAccept={() => {}} onReject={() => {}} />
          )}
        </View>

        {rightThumb}
      </View>
    </View>
  );
};
