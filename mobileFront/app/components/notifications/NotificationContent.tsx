import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimeAgo } from "./TimeAgo";
import { NotificationItemData } from "./types";
import { useAcceptFollowRequestMutation, useRejectFollowRequestMutation } from "../../lib/APIs/RTKQuery/InteractionApi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/HomeStack";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type Props = {
  item: NotificationItemData;
};

export const NotificationContent = ({ item }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const isDark = useSelector((state: RootState) => state.sheardDataThrowApp.darkMode);
  const [acceptFollowRequest, { isLoading: isAccepting }] = useAcceptFollowRequestMutation();
  const [rejectFollowRequest, { isLoading: isRejecting }] = useRejectFollowRequestMutation();

  const handleUsernamePress = () => {
    navigation.navigate("Profile", { userId: item.actor.user_id });
  };

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
    <View className="flex-1">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-6">
          <Text 
            className={clsx(
              "text-base leading-6",
              "text-gray-800 dark:text-gray-200"
            )}
            numberOfLines={3}
          >
            <TouchableOpacity onPress={handleUsernamePress} activeOpacity={0.7}>
              <Text className={clsx(
                "font-bold",
                isDark ? "text-white" : "text-black"
              )}>
                {item.actor.username}
              </Text>
            </TouchableOpacity>
            <Text className={clsx(
              "text-gray-600 dark:text-gray-400",
              isDark ? "text-white" : "text-black"
            )}>
              {getNotificationText()}
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 mx-2">•</Text>
            <TimeAgo iso={item.createdAt} />
          </Text>
        </View>

        {item.type === "FOLLOW_REQUEST" && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleAcceptFollowRequest}
              disabled={isAccepting}
              className={clsx(
                "py-2 px-4 rounded-xl items-center justify-center",
                "bg-blue-600 shadow-lg",
                "border border-blue-500",
                isAccepting && "opacity-60"
              )}
              activeOpacity={0.7}
            >
              <Text className="text-white font-bold text-sm tracking-wide">
                {isAccepting ? "Accepting..." : "Accept"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRejectFollowRequest}
              disabled={isRejecting}
              className={clsx(
                "py-2 px-4 rounded-xl items-center justify-center",
                "border-2 border-gray-300 dark:border-gray-600",
                "bg-transparent",
                isRejecting && "opacity-60"
              )}
              activeOpacity={0.7}
            >
              <Text className={clsx(
                "text-gray-700 dark:text-gray-300 font-semibold text-sm tracking-wide",
                isDark ? "text-white" : "text-black"
              )}>
                {isRejecting ? "Rejecting..." : "Reject"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
