import React, { useMemo } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../../App";

type R = RouteProp<MainStackParamList, "MemoryDetails">;

export default function MemoryDetailsScreen() {
  const route = useRoute<R>();
  const { memories, startIndex = 0 } = route.params; 
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const iconColor = isDark ? "white" : "black";
  const bgColor = isDark ? "#000" : "#fff";

  const { height: H, width: W } = Dimensions.get("window");

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({
      length: H,
      offset: H * index,
      index,
    }),
    [H]
  );

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ height: H, width: W, backgroundColor: bgColor }}>
      <Image
        source={{ uri: item }}
        style={{ width: "100%", height: "85%" }}
        resizeMode="cover"
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 35,   
        }}
      >
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={26} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
