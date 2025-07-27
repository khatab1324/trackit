import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./app/navigation/Authstack";
import "./global.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import HomeStack from "./app/navigation/HomeStack";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addUserToReducer } from "./app/store/slices/userSlice";

function AppNavigator() {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const token = useSelector((state: any) => state.auth.token);
  
  return (
    <NavigationContainer>
      {isAuthenticated && token ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
