import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import EmailVerificationScreen from "../screens/EmailVerificationScreen";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  EmailVerification: { email: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SigninScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
    </Stack.Navigator>
  );
}
