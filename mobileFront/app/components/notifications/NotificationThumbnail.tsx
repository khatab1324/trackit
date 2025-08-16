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
      className="ml-3"
      activeOpacity={0.8}
      style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 8, 
        overflow: "hidden" 
      }}
    >
      <Image 
        source={{ uri: item.memo!.content_url }} 
        style={{ width: "100%", height: "100%" }} 
      />
    </TouchableOpacity>
  );
};
