import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/HomeStack";
import clsx from "clsx";
import { MainStackParamList } from "../../../App";
export const HeaderMemo = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const isHomeScreen = useNavigationState(
    (state) => state.routes[state.index].name === "Home"
  );
  const isFriendsScreen = useNavigationState(
    (state) => state.routes[state.index].name === "FriendsMemo"
  );
  return (
    <View>
      {isHomeScreen || isFriendsScreen ? (
        <View className="absolute top-10 left-0 right-0 p-4 z-10 w-full">
          <View className="flex-row items-center justify-center gap-x-4">
            <View className=" absolute right-0 flex-row items-center justify-center ">
              <Text className="text-white text-lg font-semibold">
                <Feather name="bell" size={24} color="white" />
              </Text>
            </View>
            <TouchableOpacity
              className=" items-center gap-2"
              onPress={() => {
                navigation.replace("NearMemories");
              }}
            >
              <Text
                className={clsx(
                  "text-lg font-semibold",
                  isHomeScreen ? "text-slate-400" : "text-white"
                )}
              >
                Near Memo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => {
                navigation.replace("FriendsMemo");
              }}
            >
              <Text
                className={clsx(
                  "text-lg font-semibold",
                  isFriendsScreen ? "text-slate-400" : "text-white"
                )}
              >
                {" "}
                Friends Memo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          className="absolute left-3 top-14 z-10"
          onPress={() => (navigation as any).goBack?.()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
