import React from "react";
import { View } from "react-native";
import { NotificationAvatar } from "./NotificationAvatar";
import { NotificationContent } from "./NotificationContent";
import { NotificationThumbnail } from "./NotificationThumbnail";
import { NotificationItemData } from "./types";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const NotificationItem = ({ item }: { item: NotificationItemData }) => {
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  
  return (
    <View className={clsx(
      "px-6 py-5 mx-2 my-2 rounded-xl",
      isDark ? "bg-gray-900" : "bg-gray-50"
    )}>
      <View className="flex-row items-start ">
        <NotificationAvatar avatar={item.actor.avatar_url} userId={item.actor.user_id} />
        <View className="flex-1">
          <NotificationContent item={item} />
        </View>
        <NotificationThumbnail item={item} />
      </View>
    </View>
  );
};
