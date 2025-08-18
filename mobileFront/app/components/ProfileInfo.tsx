import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";
import { Image, Text, View } from "react-native";
import React from "react";
import { imgRegistry } from "../core/utils/assetsRegistry";
import { colors } from "../core/theme/colors";
import { ThemedText } from "../components/ThemedText";

export default function ProfileInfo() {
    const user = useSelector((state: RootState) => state.user) as User;
    const theme = useSelector((state: RootState) => state.theme.current);
    const themeColors = colors[theme];

    return (
        <View className="flex-row items-start">
            <Image
                source={{
                    uri:
                        user?.profileImage ||
                        imgRegistry.defaultProfileIcon,
                }}
                className="w-20 h-20 rounded-full bg-gray-200"
                style={{
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: themeColors.primary,
                }}
            />
            <View className="ml-4 mt-2">
                <ThemedText className={`text-lg font-semibold`}>
                    {user?.username || "Username"}
                </ThemedText>
                <ThemedText type="placeholder">
                    {user?.bio || "Bio goes here..."}
                </ThemedText>
            </View>
        </View>
    );
}