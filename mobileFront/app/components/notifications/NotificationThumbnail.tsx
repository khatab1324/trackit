import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NotificationItemData } from "./types";

type Props = {
  item: NotificationItemData;
};

export const NotificationThumbnail = ({ item }: Props) => {
  const navigation = useNavigation<any>();

  const goToMemo = () => {
    if (item.memo?.id) {
      navigation.navigate("MemoryDetails", {
        memories: [{ 
          id: item.memo.id, 
          content_url: item.memo.content_url || "" 
        }],
        startIndex: 0,
      });
    }
  };

  const shouldShowThumbnail = 
    (item.type === "LIKE" || item.type === "COMMENT") && 
    item.memo?.content_url;

  if (!shouldShowThumbnail) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={goToMemo}
      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.memo!.content_url }} 
        className="w-full h-full"
      />
    </TouchableOpacity>
  );
};
