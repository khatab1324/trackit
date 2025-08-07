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
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { useGetCurrentUserMemoriesMutation } from "../lib/APIs/RTKQuery/memoryApi";
import { setMemories } from "../store/slices/memorySlice";

type UserType = {
  username?: string;
  bio?: string;
  profileImage?: string;
  memoriesCount?: number;
  friendsCount?: number;
};

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("Memories");
  const user = useSelector((state: RootState) => state.user) as UserType;
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  type Memory = {
    id: string;
    content_type: string;
    content_url: string;
    count: string;
    description?: string;
    isFollowed: boolean;
    is_saved: boolean;
    lang: number;
    long: number;
    num_comments: string;
    num_likes: string;
    userInfo: {
      user_id: string;
      username: string;
    };
  };

  const [memories, setMemories] = useState<
    { id: string; content_url: string }[]
  >([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [getCurrentUserMemories, { isLoading, isError }] =
    useGetCurrentUserMemoriesMutation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const result = await getCurrentUserMemories();
        if (!result) throw new Error("coookiiie");
        if (result.data) {
          const { data } = result.data as { id: string; content_url: string }[];
          console.log(data);

          setMemories(data || []);
        } else if ("error" in result) {
          console.error("Error fetching memories:", result.error);
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    });

    return unsubscribe;
  }, [navigation, getCurrentUserMemories]);

  const bg = isDark ? "bg-black" : "bg-white";
  const text = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const border = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "white" : "black";

  const renderMemoryItem = ({ item }: { item: Memory }) => (
    <View className="mb-4 ">
      <Image
        source={{ uri: item.content_url }}
        className="w-32 h-36 rounded-lg"
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className={`flex-1 px-4 pt-12 ${bg}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-2xl font-bold ${text}`}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
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
          <Text className={`${subText}`}>
            {user?.bio || "Bio goes here..."}
          </Text>
        </View>
      </View>

      {/* Stats */}
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

      {/* Tabs */}
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

      {/* Tab Content */}
      {activeTab === "Memories" ? (
        isLoading ? (
          <ActivityIndicator size="large" color={iconColor} className="mt-10" />
        ) : isError ? (
          <Text className={`${subText} text-center mt-10`}>
            Failed to load memories.
          </Text>
        ) : memories?.length ? (
          <FlatList
            data={memories}
            keyExtractor={(item) => item.id}
            renderItem={renderMemoryItem}
            className="mb-10"
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }} // Add spacing between columns
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
