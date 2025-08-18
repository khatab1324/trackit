import React, { useEffect } from "react";
import SignupScreen from "../screens/SignupScreen";
import SigninScreen from "../screens/SigninScreen";
import EmailVerificationScreen from "../screens/EmailVerificationScreen";
import { createStackNavigator } from "@react-navigation/stack";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  EmailVerification: { email: string };
  Home: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SigninScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
