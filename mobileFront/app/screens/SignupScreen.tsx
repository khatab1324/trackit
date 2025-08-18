import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useSignupMutation } from "../lib/APIs/RTKQuery/authApi";
import { User } from "../core/types/user";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signup, { isLoading }] = useSignupMutation();

  const handleSignup = async () => {
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const result = await signup({ username, password, email });
      if ("data" in result) {
        if (result.data) {
          navigation.navigate("VerifyEmail", { email });
        }
      } else if ("error" in result) {
        setErrorMessage("Account already exists.");
        console.log("Signup RTK error:", result.error);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
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

      {errorMessage ? (
        <Text className="text-red-500 text-center mb-2">{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        className="bg-blue-500 rounded-full py-3 items-center mt-3"
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">
          {isLoading ? "Signing up..." : "Sign up"}
        </Text>
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