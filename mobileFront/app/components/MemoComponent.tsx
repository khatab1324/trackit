import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import type { Memory } from "../core/types/memory";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { HeaderMemo } from "./Memo/HeaderMemo";
import { InteractionMemo } from "./Memo/InteractionMemo";
import { UserMemo } from "./Memo/UserMemo";
import { CommentSection } from "./Memo/CommentSection";
import MemoryOptionsMenu from "./MemoryOptionsMenu";  

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
  const currentUser = useSelector((state: RootState) => state.user);


  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUserId =
    (currentUser as any)?.id ?? (currentUser as any)?.user_id ?? null;

  const isOwner = memory.userInfo?.user_id === currentUserId;
  const isPrivate = false;
  const currentCaption = memory.description || "Test Caption";

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

      {isOwner && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 10,
            bottom: 50,  
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 999,
          }}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#F3F4F6" />
        </TouchableOpacity>
      )}

      <MemoryOptionsMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        isPrivate={isPrivate}
        currentCaption={currentCaption}
        onTogglePrivacy={(next) => console.log("Toggle privacy:", next)}
        onUpdateCaption={(cap) => console.log("Update caption:", cap)}
        onDelete={() => console.log("Delete memory")}
      />

      {memory.userInfo.user_id !== currentUserId && (
        <UserMemo
          username={memory.userInfo.username}
          userId={memory.userInfo.user_id}
          description={memory.description}
          isFollowed={memory.isFollowed}
          isRequested={memory.is_requested}
          currentUserId={currentUserId}
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
