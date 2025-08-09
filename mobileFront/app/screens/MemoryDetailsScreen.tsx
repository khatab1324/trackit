import React, { useMemo } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { MainStackParamList } from "../../App";
import { RootState } from "../store";
import {
  useToggleLikeMutation,
  useToggleSaveMutation,
} from "../lib/APIs/RTKQuery/memoryApi";
import { patchOneInViewer } from "../store/slices/memorySlice";

type R = RouteProp<MainStackParamList, "MemoryDetails">;

export default function MemoryDetailsScreen() {
  const route = useRoute<R>();
  const { memories, startIndex = 0 } = route.params; // string[]
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const iconColor = isDark ? "white" : "black";
  const textColor = iconColor;
  const bgColor = isDark ? "#000" : "#fff";
  const { height: H, width: W } = Dimensions.get("window");

  // الميموريز الكاملة المخزنة بالريدكس
  const viewer = useSelector((s: RootState) => s.memory.viewerMemories);
  const dispatch = useDispatch();

  // API mutations
  const [toggleLike] = useToggleLikeMutation();
  const [toggleSave] = useToggleSaveMutation();

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({ length: H, offset: H * index, index }),
    [H]
  );

  // ---- Handlers (Optimistic UI) ----
  const onLikePress = async (contentUrl: string) => {
    const meta = viewer.find(m => m.content_url === contentUrl);
    if (!meta) return;

    const wasLiked = !!meta.is_liked;
    const currentLikes = meta.num_likes ?? 0;
    const nextLiked = !wasLiked;
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));

    // تحديث فوري محلي
    dispatch(
      patchOneInViewer({
        id: meta.id,
        is_liked: nextLiked,
        num_likes: nextLikes,
      })
    );

    // نداء API
    try {
      await toggleLike({ memoryId: meta.id }).unwrap();
    } catch {
      dispatch(
        patchOneInViewer({
          id: meta.id,
          is_liked: wasLiked,
          num_likes: currentLikes,
        })
      );
    }
  };

  const onSavePress = async (contentUrl: string) => {
    const meta = viewer.find(m => m.content_url === contentUrl);
    if (!meta) return;

    const wasSaved = !!meta.is_saved;
    const nextSaved = !wasSaved;

    dispatch(
      patchOneInViewer({
        id: meta.id,
        is_saved: nextSaved,
      })
    );

    try {
      await toggleSave({ memoryId: meta.id }).unwrap();
    } catch {
      dispatch(
        patchOneInViewer({
          id: meta.id,
          is_saved: wasSaved,
        })
      );
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    // item = content_url
    const meta = viewer.find(m => m.content_url === item);

    const likes = meta?.num_likes ?? 0;
    const comments = meta?.num_comments ?? 0;
    const isLiked = !!meta?.is_liked;
    const isSaved = !!meta?.is_saved;
    const username =
      meta?.userInfo?.username ??
      (meta as any)?.user?.username ?? // لو السيرفر بيرجع user بدل userInfo
      "Unknown";
    const desc = meta?.description ?? "";

    return (
      <View style={{ height: H, width: W, backgroundColor: bgColor }}>
        <Image source={{ uri: item }} style={{ width: "100%", height: "85%" }} resizeMode="cover" />

        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={{ color: textColor, fontWeight: "600" }}>{username}</Text>
          {!!desc && <Text style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>{desc}</Text>}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 10 }}>
            {/* Like */}
            <TouchableOpacity
              onPress={() => onLikePress(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={26}
                color={isLiked ? "red" : iconColor}
              />
              <Text style={{ color: textColor }}>{likes}</Text>
            </TouchableOpacity>

            {/* Comments */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="chatbubble-outline" size={24} color={iconColor} />
              <Text style={{ color: textColor }}>{comments}</Text>
            </View>

            {/* Save */}
            <TouchableOpacity
              onPress={() => onSavePress(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isSaved ? "#3b82f6" : iconColor}
              />
              <Text style={{ color: textColor }}>{isSaved ? "Saved" : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={memories}
      keyExtractor={(uri, i) => `${uri}-${i}`}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      initialScrollIndex={startIndex}
      getItemLayout={getItemLayout}
      windowSize={3}
    />
  );
}
