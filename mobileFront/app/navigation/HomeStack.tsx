import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SearchScreen } from "../screens/SeachScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Stack = createBottomTabNavigator<HomeStackParamList>();
export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
