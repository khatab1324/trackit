import React from "react";
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
  return (
    <View
      className="bg-black relative "
      style={{ height: screenHeight, width: screenWidth }}
    >
      <HeaderMemo />

      <Image
        source={{ uri: memory.content_url }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <InteractionMemo
        num_comments={memory.num_comments}
        num_likes={memory.num_likes}
      />

      {memory.userInfo.user_id !== currentUser.id && (
        <UserMemo
          username={memory.userInfo.username}
          userId={memory.userInfo.user_id}
          description={memory.description}
        />
      )}
    </View>
  );
};
