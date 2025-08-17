import React from "react";
import SignupScreen from "../screens/SignupScreen";
import SigninScreen from "../screens/SigninScreen"; 
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import { createStackNavigator } from "@react-navigation/stack";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  Home: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SigninScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}
