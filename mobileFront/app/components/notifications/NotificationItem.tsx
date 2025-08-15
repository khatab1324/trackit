import React from "react";
import { View } from "react-native";
import { NotificationAvatar } from "./NotificationAvatar";
import { NotificationContent } from "./NotificationContent";
import { NotificationThumbnail } from "./NotificationThumbnail";
import { NotificationItemData } from "./types";

export const NotificationItem = ({ item }: { item: NotificationItemData }) => {
  return (
    <View className="px-4 py-3">
      <View className="flex-row items-start">
        <NotificationAvatar avatar={item.actor.avatar_url} userId={item.actor.user_id} />
        <NotificationContent item={item} />
        <NotificationThumbnail item={item} />
      </View>
    </View>
  );
};