import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user";

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

const EmailVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const dispatch = useDispatch();

  const { email } = route.params;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerificationCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 6) {
      setVerificationCode(numericText);
      setErrorMessage("");
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      setErrorMessage("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode: parseInt(verificationCode),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data.data;
        
        await AsyncStorage.setItem("token", token);
        dispatch(setCredentials(token));
        dispatch(addUserToReducer(user));
        
        navigation.replace("Home");
      } else {
        setErrorMessage(data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    Alert.alert("Resend Code", "This feature will be implemented soon.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.codeContainer}>
          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={handleVerificationCodeChange}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (isLoading || verificationCode.length !== 6) && styles.disabledButton,
          ]}
          onPress={handleVerifyEmail}
          disabled={isLoading || verificationCode.length !== 6}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Text>
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Code expires in: {formatTime(timeLeft)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={timeLeft > 0}
        >
          <Text style={[
            styles.resendButtonText,
          ]}>
            Resend Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  email: {
    fontWeight: "600",
    color: "#007AFF",
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 2,
    backgroundColor: "#F8F9FA",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  verifyButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#666",
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledResendText: {
    color: "#C7C7CC",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default EmailVerificationScreen; 