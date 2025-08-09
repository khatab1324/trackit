import React, { useEffect, useState } from "react";
import { Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";
import * as Location from "expo-location";

import { useGetNearMemoriesMutation } from "../lib/APIs/RTKQuery/memoryApi";
import { useDispatch } from "react-redux";
import { setViewerMemories, UIMemory } from "../store/slices/memorySlice";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export default function NearMemoriesScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(null);
  const [getNear, { data, isLoading, error }] = useGetNearMemoriesMutation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const pos = { lat: String(loc.coords.latitude), lng: String(loc.coords.longitude) };
        setCoords(pos);
        getNear(pos);
      }
    })();
  }, []);

  if (!coords) return <Text>جاري تحديد موقعك…</Text>;
  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>خطأ أثناء جلب الذكريات القريبة</Text>;
  if (!data?.length) return <Text>لا توجد ذكريات قريبة حالياً.</Text>;

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
            dispatch(setViewerMemories(list)); // نخزن النسخة المطبّعة
            navigation.navigate("MemoryDetails", {
              memories: list.map(m => m.content_url), // نبعت روابط فقط
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
