import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Memory } from "../core/types/memory";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";
import { hp } from "../core/theme/responsiveHandler";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";

export default function MemoryThumbnail({ item }: { item: Memory }) {
  const isDark = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const colorScheme = isDark ? colors.dark : colors.light;
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: hp(30),
        marginBottom: hp(1),
        position: "relative",
        borderRadius: 9,
        overflow: "hidden",
      }}
      onPress={() => navigation.navigate("CurrentUserMemo")}
    >
      <Image
        source={{ uri: item.content_url }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        start={{ x: 0.5, y: 2 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <Text
          className="font-light text-sm"
          style={{
            color: colorScheme.white,
          }}
        >
          {`${item.num_likes} likes, ${item.num_comments} comments`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
