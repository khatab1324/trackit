import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";
import { Image, Text, View } from "react-native";
import React from "react";
import { imgRegistry } from "../core/utils/assetsRegistry";
import { colors } from "../core/theme/colors";

export default function ProfileInfo() {
    const user = useSelector((state: RootState) => state.user) as User;
    const isDark = useSelector(
        (state: RootState) => state.sheardDataThrowApp.darkMode
    );
    const colorScheme = isDark ? colors.dark : colors.light;

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
                    borderColor: colorScheme.primary,
                }}
            />
            <View className="ml-4 mt-2">
                <Text className={`text-lg font-semibold`} style={{ color: colorScheme.text }}>
                    {user?.username || "Username"}
                </Text>
                <Text style={{ color: colorScheme.secondaryText }}>
                    {user?.bio || "Bio goes here..."}
                </Text>
            </View>
        </View>
    );
}