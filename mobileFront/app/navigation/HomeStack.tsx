import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeScreen } from "../screens/HomeScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SettingScreen } from "../screens/SettingScreen";
import { MapScreen } from "../screens/MapScreen";
import { CurrentUserMemoScreen } from "../screens/CurrentUserMemoScreen";

export type HomeStackParamList = {
  Map: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Settings: undefined;
  CurrentUserMemo: undefined;
};

const Tab = createBottomTabNavigator<HomeStackParamList>();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const avatarUri: string | undefined = undefined;
  const visibleRoutes = ["Map", "Chat", "Home", "Profile"];

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.container}>
        {state.routes
          .filter((r: any) => visibleRoutes.includes(r.name))
          .map((route: any) => {
            const isFocused =
              state.index === state.routes.findIndex((rr: any) => rr.name === route.name);

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const color = isFocused ? "#111" : "#767676";

            let icon = null;
            if (route.name === "Home") {
              icon = <Ionicons name={isFocused ? "home" : "home-outline"} size={26} color={color} />;
            } else if (route.name === "Chat") {
              icon = <Ionicons name={isFocused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />;
            } else if (route.name === "Map") {
              icon = (
                <Ionicons
                  name={isFocused ? "compass" : "compass-outline"}
                  size={26}
                  color={color}
                />
              );
            } else if (route.name === "Profile") {
              icon = avatarUri ? (
                <View style={[styles.avatarWrap, isFocused && styles.avatarActive]}>
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                </View>
              ) : (
                <Ionicons
                  name={isFocused ? "person-circle" : "person-circle-outline"}
                  size={26}
                  color={color}
                />
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabBtn}
                hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              >
                <View style={styles.iconLift}>{icon}</View>
              </TouchableOpacity>
            );
          })}
      </View>
    </SafeAreaView>
  );
}

export default function HomeStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* شاشات خارج الشريط */}
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      <Tab.Screen
        name="CurrentUserMemo"
        component={CurrentUserMemoScreen}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff", // دمج لون الشريط مع الخلفية
  },
  container: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 18,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0,     
    elevation: 0,          
    shadowOpacity: 0,      
    shadowRadius: 0,
    shadowColor: "transparent",
  },
  tabBtn: { flex: 1, alignItems: "center" },
  iconLift: { transform: [{ translateY: -2 }] }, 
  avatarWrap: { borderRadius: 999 },
  avatarActive: { borderWidth: 2, borderColor: "#111", padding: 2 },
  avatar: { width: 26, height: 26, borderRadius: 999 },
});
