import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./app/navigation/Authstack";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomeStack from "./app/navigation/HomeStack";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateMemoryScreen } from "./app/screens/CreateMemoryScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type MainStackParamList = {
  Home: undefined;
  Auth: undefined;
  CreateMemory: undefined;
};

function AppNavigator() {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const token = useSelector((state: any) => state.auth.token);

  const RootStack = createNativeStackNavigator<MainStackParamList>();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && token ? (
          <>
            <RootStack.Screen name="Home" component={HomeStack} />
            <RootStack.Screen
              name="CreateMemory"
              component={CreateMemoryScreen}
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
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
