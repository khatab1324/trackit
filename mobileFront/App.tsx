import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import AuthStack from "./app/navigation/Authstack";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomeStack from "./app/navigation/HomeStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateMemoryScreen from "./app/screens/CreateMemoryScreen";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { CurrentUserMemoScreen } from "./app/screens/CurrentUserMemoScreen";
import FriendsMemoScreen from "./app/screens/FriendsMemoScreen";

export type MainStackParamList = {
  Home: undefined;
  Auth: undefined;
  CreateMemory: undefined;
  NearMemories: undefined;
  FriendsMemo: undefined;
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
        {isAuthenticated && token ? (
          <>
            <RootStack.Screen name="Home" component={HomeStack} />
            <RootStack.Screen
              name="CreateMemory"
              component={CreateMemoryScreen}
            />
            <RootStack.Screen
              name="NearMemories"
              // TODO: change this to NearMemoScreen
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
