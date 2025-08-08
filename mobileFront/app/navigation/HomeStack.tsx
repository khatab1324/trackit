import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChatScreen } from "../screens/ChatScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SettingScreen } from "../screens/SettingScreen";
import { MapScreen } from "../screens/MapScreen";
export type HomeStackParamList = {
  Map: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Settings: undefined;
};
const Stack = createBottomTabNavigator<HomeStackParamList>();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
    </Stack.Navigator>
  );
}
