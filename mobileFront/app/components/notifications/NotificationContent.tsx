import React from "react";
import { View, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { TimeAgo } from "./TimeAgo";
import { FollowRequestActions } from "./FollowRequestActions";
import { NotificationItemData } from "./types";
import { useAcceptFollowRequestMutation, useRejectFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";

type Props = {
  item: NotificationItemData;
};

export const NotificationContent = ({ item }: Props) => {
  const [acceptFollowRequest, { isLoading: isAccepting }] = useAcceptFollowRequestMutation();
  const [rejectFollowRequest, { isLoading: isRejecting }] = useRejectFollowRequestMutation();

  const handleAcceptFollowRequest = async () => {
    if (item.request_id) {
      try {
        await acceptFollowRequest({ request_id: item.request_id }).unwrap();
      } catch (error) {
        console.error("Failed to accept follow request:", error);
      }
    }
  };

  const handleRejectFollowRequest = async () => {
    if (item.request_id) {
      try {
        await rejectFollowRequest({ request_id: item.request_id }).unwrap();
      } catch (error) {
        console.error("Failed to reject follow request:", error);
      }
    }
  };

  const getNotificationText = () => {
    switch (item.type) {
      case "COMMENT":
        return ` commented: ${item.comment_text ?? ""}`;
      case "LIKE":
        return " liked your memory";
      case "FOLLOW_REQUEST":
        return " requested to follow you";
      case "FOLLOW_ACCEPTED":
        return " accepted your follow request";
      default:
        return "";
    }
  };

  return (
    <View className="flex-1 ml-3">
      <ThemedText 
        style={{ lineHeight: 20 }} 
        numberOfLines={3}
      >
        <ThemedText className="font-semibold">{item.actor.username}</ThemedText>
        {getNotificationText()}
        {" · "}
        <TimeAgo iso={item.createdAt} />
      </ThemedText>

      {item.type === "FOLLOW_REQUEST" && (
        <FollowRequestActions 
          onAccept={handleAcceptFollowRequest} 
          onReject={handleRejectFollowRequest}
          loadingAccept={isAccepting}
          loadingReject={isRejecting}
        />
      )}
    </View>
  );
};
