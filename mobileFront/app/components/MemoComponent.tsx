import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import type { Memory } from "../core/types/memory";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigationState } from "@react-navigation/native";
import { HeaderMemo } from "./Memo/HeaderMemo";
import { InteractionMemo } from "./Memo/InteractionMemo";
import { UserMemo } from "./Memo/UserMemo";
import { CommentSection } from "./Memo/CommentSection";

type Props = {
  memory: Memory;
  screenHeight: number;
  screenWidth: number;
};

export const MemoComponent: React.FC<Props> = ({
  memory,
  screenHeight,
  screenWidth,
}) => {
  const navigation = useNavigation();
  const currentUser = useSelector((state: RootState) => state.user);
  const isHomeScreen = useNavigationState(
    (state) => state.routes[state.index].name === "Home"
  );
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  return (
    <View
      className="bg-black relative"
      style={{ height: screenHeight, width: screenWidth }}
    >
      <HeaderMemo />

      <Image
        source={{ uri: memory.content_url }}
        className="absolute top-0 left-0 right-0 w-full"
        style={{ height: screenHeight - 43 }} 
        resizeMode="cover"
      />
      <InteractionMemo
        memoryId={memory.id}
        num_comments={memory.num_comments}
        num_likes={memory.num_likes}
        isLiked={memory.is_liked}
        isSaved={memory.is_saved}
        onCommentPress={() => setIsCommentSectionVisible(true)}
      />

      {memory.userInfo.user_id !== (currentUser as any).id && (
        <UserMemo
          username={memory.userInfo.username}
          userId={memory.userInfo.user_id}
          description={memory.description}
          isFollowed={memory.isFollowed}
          isRequested={memory.is_requested}
          currentUserId={(currentUser as any).id}
        />
      )}

      <CommentSection
        memoryId={memory.id}
        isVisible={isCommentSectionVisible}
        onClose={() => setIsCommentSectionVisible(false)}
      />
    </View>
  );
};
