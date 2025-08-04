import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/sheardDataSlice";
import { RootState } from "../store";

export function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const iconColor = isDarkMode ? "white" : "black";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const iconBoxColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";

  const settings = [
    {
      icon: <Ionicons name="lock-closed-outline" size={22} color={iconColor} />,
      label: "Edit Password",
      onPress: () => {},
    },
    {
      icon: <Ionicons name="globe-outline" size={22} color={iconColor} />,
      label: "Language",
      onPress: () => {},
    },
    {
      icon: <Feather name="edit-3" size={22} color={iconColor} />,
      label: "Edit Bio",
      onPress: () => {},
    },
    {
      icon: <MaterialIcons name="person-outline" size={22} color={iconColor} />,
      label: "Edit Username",
      onPress: () => {},
    },
  ];

  return (
    <View className={`flex-1 px-4 pt-14 ${bgColor}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
        <Text className={`text-lg font-bold ${textColor}`}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Settings List */}
      {settings.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className="flex-row items-center mb-5"
        >
          <View className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}>
            {item.icon}
          </View>
          <Text className={`text-base ${textColor}`}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}>
            <Feather name="moon" size={22} color={isDarkMode ? "#B87333" : "#333"} />
          </View>
          <Text className={`text-base ${textColor}`}>Dark Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={handleToggleTheme} />
      </View>

      {/* Delete Account */}
      <TouchableOpacity onPress={() => {}} className="flex-row items-center mb-5">
        <View className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}>
          <FontAwesome name="trash-o" size={22} color={iconColor} />
        </View>
        <Text className={`text-base ${textColor}`}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}
