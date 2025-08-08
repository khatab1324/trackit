import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";
import { RootState } from "../store";

import { MainStackParamList } from "../../App";
import { HomeStackParamList } from "../navigation/HomeStack";

import { useGetCurrentUserMemoriesMutation } from "../lib/APIs/RTKQuery/memoryApi";

type UserType = {
  username?: string;
  bio?: string;
  profileImage?: string;
  memoriesCount?: number;
  friendsCount?: number;
};

type SimpleMemory = { id: string; content_url: string };

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList>,
  BottomTabNavigationProp<HomeStackParamList>
>;

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<"Memories" | "Saved">("Memories");
  const user = useSelector((state: RootState) => state.user) as UserType;
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  const navigation = useNavigation<Nav>();

  const [memories, setMemories] = useState<SimpleMemory[]>([]);
  const [getCurrentUserMemories, { isLoading, isError }] =
    useGetCurrentUserMemoriesMutation();

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      try {
        const resAny: any = await getCurrentUserMemories().unwrap();
        const list = Array.isArray(resAny)
          ? resAny
          : resAny?.data ?? resAny?.memories ?? resAny?.results ?? [];
        const mapped: SimpleMemory[] = (list ?? [])
          .map(
            (m: any): SimpleMemory => ({
              id: String(m.id ?? m._id ?? m.memory_id ?? ""),
              content_url: String(m.content_url ?? m.url ?? m.imageUrl ?? ""),
            })
          )
          .filter((x: SimpleMemory) => x.id && x.content_url);

        setMemories(mapped);
      } catch (e) {
        console.error("Error loading memories:", e);
        setMemories([]);
      }
    });

    return unsub;
  }, [navigation, getCurrentUserMemories]);

  const bg = isDark ? "bg-black" : "bg-white";
  const text = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const border = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "white" : "black";

  const renderMemoryItem = ({
    item,
    index,
  }: {
    item: SimpleMemory;
    index: number;
  }) => (
    <TouchableOpacity
      className="mb-1"
      onPress={() =>
        navigation.navigate("MemoryDetails", {
          memories: memories.map((m) => m.content_url),   
          startIndex: index,  
        })
      }
    >
      <Image
        source={{ uri: item.content_url }}
        className="w-32 h-32 rounded-lg"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 px-4 pt-12 ${bg}`}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-2xl font-bold ${text}`}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start">
        <Image
          source={{
            uri:
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-20 h-20 rounded-full bg-gray-200"
        />
        <View className="ml-4 mt-2">
          <Text className={`text-lg font-semibold ${text}`}>
            {user?.username || "Username"}
          </Text>
          <Text className={`${subText}`}>{user?.bio || "Bio goes here..."}</Text>
        </View>
      </View>

      <View className="flex-row justify-around mt-6 mb-4">
        <View className="items-center">
          <Text className={`text-lg font-bold ${text}`}>
            {memories.length || 0}
          </Text>
          <Text className={`${subText}`}>Memories</Text>
        </View>
        <View className="items-center">
          <Text className={`text-lg font-bold ${text}`}>
            {user?.friendsCount || 0}
          </Text>
          <Text className={`${subText}`}>Friends</Text>
        </View>
      </View>

      <View className={`flex-row justify-around border-b mb-4 ${border}`}>
        <TouchableOpacity onPress={() => setActiveTab("Memories")}>
          <Text
            className={`pb-2 ${
              activeTab === "Memories"
                ? `border-b-2 font-semibold ${text} border-${
                    isDark ? "white" : "black"
                  }`
                : `${subText}`
            }`}
          >
            Memories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Saved")}>
          <Text
            className={`pb-2 ${
              activeTab === "Saved"
                ? `border-b-2 font-semibold ${text} border-${
                    isDark ? "white" : "black"
                  }`
                : `${subText}`
            }`}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Memories" ? (
        isLoading ? (
          <ActivityIndicator size="large" color={iconColor} className="mt-10" />
        ) : isError ? (
          <Text className={`${subText} text-center mt-10`}>
            Failed to load memories.
          </Text>
        ) : memories?.length ? (
          <FlatList<SimpleMemory>
            data={memories}
            keyExtractor={(item) => item.id}
            renderItem={renderMemoryItem}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text className={`${subText} text-center mt-10`}>
            No memories found.
          </Text>
        )
      ) : (
        <Text className={`${subText} text-center mt-10`}>
          No saved content yet.
        </Text>
      )}
    </View>
  );
}
