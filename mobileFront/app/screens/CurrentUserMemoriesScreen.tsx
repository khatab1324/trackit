import React, { useEffect } from "react";
import { Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";

import { useGetCurrentUserMemoriesMutation } from "../lib/APIs/RTKQuery/memoryApi";
import { useDispatch } from "react-redux";
import { setViewerMemories, UIMemory } from "../store/slices/memorySlice";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export default function CurrentUserMemoriesScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const [getMemories, { data, isLoading, error }] = useGetCurrentUserMemoriesMutation();

  useEffect(() => {
    getMemories();
  }, []);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>حدث خطأ أثناء جلب ذكرياتك</Text>;
  if (!data?.length) return <Text>لا توجد ذكريات حتى الآن.</Text>;

  // 🔽 normalize
  const list: UIMemory[] = (data as any[]).map((m) => ({
    id: m.id,
    content_url: m.content_url,
    title: m.title,
    description: m.description,
    num_likes: m.num_likes ?? m.likesCount ?? m.likes ?? 0,
    num_comments: m.num_comments ?? m.commentsCount ?? m.comments ?? 0,
    is_liked: m.is_liked ?? m.liked ?? false,
    is_saved: m.is_saved ?? m.saved ?? false,
    userInfo: {
      username: m.userInfo?.username ?? m.user?.username ?? m.username ?? "Unknown",
    },
  }));

  return (
    <FlatList
      data={list}
      keyExtractor={(m) => m.id}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => {
            dispatch(setViewerMemories(list)); 
            navigation.navigate("MemoryDetails", {
              memories: list.map(m => m.content_url),   
              startIndex: index,
            });
          }}
          style={{ marginBottom: 16 }}
        >
          <Image source={{ uri: item.content_url }} style={{ height: 220, borderRadius: 12 }} />
          <Text style={{ marginTop: 6, fontWeight: "600" }}>{item.title ?? ""}</Text>
          <Text>❤️ {item.num_likes ?? 0}   💬 {item.num_comments ?? 0}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
