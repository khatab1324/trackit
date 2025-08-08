//
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useSignupMutation } from "../lib/APIs/RTKQuery/authApi";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const result = await signup({ username, password, email });
      if ("data" in result) {
        console.log("Signup Success:", result.data);
        if (result.data) {
          const { token, createdUser } = result.data?.data as {
            token: string;
            createdUser: User;
          };
          dispatch(setCredentials(token));
          await AsyncStorage.setItem("token", token);
          dispatch(addUserToReducer(createdUser));
          navigation.replace("Home");
        }
      } else {
        console.log("Signup RTK error:", result.error);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-3xl font-bold text-center mb-8">TrackIt 📍</Text>

      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        className="bg-blue-500 rounded-full py-3 items-center mt-3"
        onPress={handleSignup}
      >
        <Text className="text-white font-bold">Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text className="text-gray-500 text-center mt-6">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
