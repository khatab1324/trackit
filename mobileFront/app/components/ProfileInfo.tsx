import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";
import { Image, Text, View } from "react-native";
import React from "react";
import { imgRegistry } from "../core/utils/assetsRegistry";
import { colors } from "../core/theme/colors";
import { ThemedText } from "../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileInfo() {
    const user = useSelector((state: RootState) => state.user) as User;
    const theme = useSelector((state: RootState) => state.theme.current);
    const themeColors = colors[theme];

    return (
        <View className="flex-row items-start">
            <Ionicons 
                name={"person-circle"} 
                size={80} 
                color={themeColors.text} 
            />
            <View className="ml-4 mt-2 flex-1">
                <ThemedText className={`text-lg font-semibold`}>
                    {user?.username || "Username"}
                </ThemedText>
                <ThemedText type="placeholder" className="flex-shrink">
                    {user?.bio || "Bio goes here..."}
                </ThemedText>
            </View>
        </View>
    );
}