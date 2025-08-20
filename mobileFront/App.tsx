import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import "./global.css";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./app/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AuthStack from "./app/navigation/Authstack";
import HomeStack from "./app/navigation/HomeStack";
import CreateMemoryScreen from "./app/screens/CreateMemoryScreen";
import { CurrentUserMemoScreen } from "./app/screens/CurrentUserMemoScreen";
import FriendsMemoScreen from "./app/screens/FriendsMemoScreen";
import { HomeScreen } from "./app/screens/HomeScreen";
import SplashScreen from "./app/screens/SplashScreen";

export type MainStackParamList = {
  Splash: undefined;
  Home: undefined;
  Auth: undefined;
  CreateMemory: undefined;
  NearMemories: undefined;
  FriendsMemo: undefined;
  MemoDetails: {
    tabComingFrom: string;
    memoId: string;
  };
};

const RootStack = createNativeStackNavigator<MainStackParamList>();

function MainAppNavigator() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const isDarkMode = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />

        {isAuthenticated && token ? (
          <>
            <RootStack.Screen name="Home" component={HomeStack} />
            <RootStack.Screen
              name="CreateMemory"
              component={CreateMemoryScreen}
            />
            <RootStack.Screen
              name="NearMemories"
              component={HomeScreen}
            />
            <RootStack.Screen
              name="MemoDetails"
              component={CurrentUserMemoScreen}
            />
            <RootStack.Screen
              name="FriendsMemo"
              component={FriendsMemoScreen}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <MainAppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
