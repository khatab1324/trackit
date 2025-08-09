import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { MainStackParamList } from "../../App";
import { RootState } from "../store";
import { setViewerMemories, UIMemory } from "../store/slices/memorySlice";
import { useGetCurrentUserMemoriesMutation } from "../lib/APIs/RTKQuery/memoryApi";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();

  const [fetchCurrentMemories, { isLoading, isError, error }] =
    useGetCurrentUserMemoriesMutation();

  const jwt = useSelector((s: RootState) => s.auth.token);
  const viewer = useSelector((s: RootState) => s.memory.viewerMemories);

  // بنحفظ روابط الصور محليًا لنمررها للـ MemoryDetails بنفس القيمة المخزنة
  const [urls, setUrls] = useState<string[]>([]);
  const numColumns = 3;
  const { width: W } = Dimensions.get("window");
  const itemSize = useMemo(() => Math.floor(W / numColumns), [W]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!jwt) return; // ما بننادي بدون توكن
      try {
        const apiList = await fetchCurrentMemories().unwrap();
        if (!mounted) return;

        // تحويل الـ API -> UIMemory (بنحافظ على نفس content_url)
        const mapped: UIMemory[] = (apiList || []).map((m: any) => ({
          id: m.id ?? m._id ?? String(Math.random()),
          content_url: m.content_url || m.contentUrl || "",
          title: m.title ?? "",
          description: m.description ?? "",
          num_likes: m.num_likes ?? m.likesCount ?? 0,
          num_comments: m.num_comments ?? m.commentsCount ?? 0,
          num_saves: m.num_saves ?? m.savesCount ?? 0,
          is_liked: !!(m.is_liked ?? m.liked),
          is_saved: !!(m.is_saved ?? m.saved),
          userInfo: {
            username:
              m.userInfo?.username ??
              m.user?.username ??
              m.owner?.username ??
              undefined,
          },
        })).filter(x => !!x.content_url);

        // خزّن بالريدكس
        dispatch(setViewerMemories(mapped));

        setUrls(mapped.map(x => x.content_url));
      } catch (e) {
        console.log("fetch memories error:", e);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [jwt]);

  const openDetailsAt = (index: number) => {
    if (!urls.length) return;
    navigation.navigate("MemoryDetails", {
      memories: urls,     
      startIndex: index,    
    });
  };

  if (isLoading && !viewer.length) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading memories…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Failed to load memories</Text>
        <Text style={{ opacity: 0.7 }}>
          {String((error as any)?.data?.message || (error as any)?.error || "Unknown error")}
        </Text>
      </View>
    );
  }

  if (!urls.length) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No memories yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={urls}
      keyExtractor={(u, i) => `${u}-${i}`}
      numColumns={numColumns}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => openDetailsAt(index)} activeOpacity={0.8}>
          <Image
            source={{ uri: item }}
            style={{ width: itemSize, height: itemSize }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
  );
};
