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
  const { memories, startIndex = 0 } = route.params;

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const iconColor = isDark ? "white" : "black";
  const textColor = iconColor;
  const bgColor = isDark ? "#000" : "#fff";
  const { height: H, width: W } = Dimensions.get("window");

  const viewer = useSelector((s: RootState) => s.memory.viewerMemories);
  const currentUser = useSelector((s: RootState) => (s as any).user) as any;
  const dispatch = useDispatch();

  const [toggleLike] = useToggleLikeMutation();
  const [toggleSave] = useToggleSaveMutation();

  const normalize = (u?: string) =>
    (u || "").trim().toLowerCase().replace(/\/+$/, "");

  // خريطة url -> meta
  const byUrl = useMemo(() => {
    const map: Record<string, any> = {};
    for (const m of viewer) {
      map[normalize(m.content_url)] = m;
    }
    return map;
  }, [viewer]);

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({ length: H, offset: H * index, index }),
    [H]
  );

  const onLikePress = async (contentUrl: string) => {
    const meta = byUrl[normalize(contentUrl)];
    if (!meta) return;

    const id = (meta.id || (meta as any)._id) as string;
    if (!id) return;

    const wasLiked = !!meta.is_liked;
    const currentLikes = meta.num_likes ?? 0;
    const nextLiked = !wasLiked;
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));

    dispatch(patchOneInViewer({ id, is_liked: nextLiked, num_likes: nextLikes }));

    try {
      await toggleLike({ memoryId: id }).unwrap();
    } catch {
      dispatch(patchOneInViewer({ id, is_liked: wasLiked, num_likes: currentLikes }));
    }
  };

  const onSavePress = async (contentUrl: string) => {
    const meta = byUrl[normalize(contentUrl)];
    if (!meta) return;

    const id = (meta.id || (meta as any)._id) as string;
    if (!id) return;

    const wasSaved = !!meta.is_saved;
    const currentSaves = meta.num_saves ?? 0;
    const nextSaved = !wasSaved;
    const nextSaves = Math.max(0, currentSaves + (nextSaved ? 1 : -1));

    dispatch(patchOneInViewer({ id, is_saved: nextSaved, num_saves: nextSaves }));

    try {
      await toggleSave({ memoryId: id }).unwrap();
    } catch {
      dispatch(patchOneInViewer({ id, is_saved: wasSaved, num_saves: currentSaves }));
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const meta = byUrl[normalize(item)];

    const likes = meta?.num_likes ?? 0;
    const saves = meta?.num_saves ?? 0;
    const comments = meta?.num_comments ?? 0;
    const isLiked = !!meta?.is_liked;
    const isSaved = !!meta?.is_saved;

    const username =
      meta?.userInfo?.username ||
      (meta as any)?.user?.username ||
      currentUser?.username ||
      "Unknown";

    const desc = meta?.description ?? "";

    return (
      <View style={{ height: H, width: W, backgroundColor: bgColor }}>
        <Image
          source={{ uri: item }}
          style={{ width: "100%", height: "85%" }}
          resizeMode="cover"
        />

        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={{ color: textColor, fontWeight: "600" }}>{username}</Text>
          {!!desc && (
            <Text style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>{desc}</Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 24,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => onLikePress(item)}
              style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}
              hitSlop={10}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={26}
                color={isLiked ? "red" : iconColor}
              />
              <Text style={{ color: textColor }}>{likes}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
              <Ionicons name="chatbubble-outline" size={24} color={iconColor} />
              <Text style={{ color: textColor }}>{comments}</Text>
            </View>

            <TouchableOpacity
              onPress={() => onSavePress(item)}
              style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}
              hitSlop={10}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isSaved ? "#3b82f6" : iconColor}
              />
              <Text style={{ color: textColor }}>{saves}</Text>
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
