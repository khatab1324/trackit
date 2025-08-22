import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/sheardDataSlice";
import { RootState } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStore } from "../store";
import { setUsername, setBio } from "../store/slices/userSlice";
import { colors } from "../core/theme/colors";
import { 
  useUpdateUsernameMutation, 
  useUpdateBioMutation, 
  useUpdatePasswordMutation 
} from "../lib/APIs/RTKQuery/userProfileApi";
import { useGetUserByTokenMutation } from "../lib/APIs/RTKQuery/UserAuth";

export function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isDarkMode = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const currentUser = useSelector((state: RootState) => state.user as any);

  // API hooks
  const [updateUsername, { isLoading: isUpdatingUsername }] = useUpdateUsernameMutation();
  const [updateBio, { isLoading: isUpdatingBio }] = useUpdateBioMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bioLocal, setBioLocal] = useState<string>(currentUser?.bio ?? "");
  const [usernameLocal, setUsernameLocal] = useState<string>(
    currentUser?.username ?? ""
  );

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const logoutHandler = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch(resetStore());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [dispatch]);

  const saveBio = useCallback(async () => {
    if (!bioLocal.trim()) {
      Alert.alert("Missing bio", "Please enter a bio.");
      return;
    }
    
    try {
      await updateBio({ bio: bioLocal }).unwrap();
      dispatch(setBio(bioLocal));
      setShowBioModal(false);
      Alert.alert("Success", "Bio updated successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.data?.error || "Failed to update bio. Please try again.");
    }
  }, [bioLocal, updateBio, dispatch]);

  const saveUsername = useCallback(async () => {
    if (!usernameLocal.trim()) {
      Alert.alert("Missing username", "Please enter a valid username.");
      return;
    }
    
    try {
      await updateUsername({ username: usernameLocal }).unwrap();
      dispatch(setUsername(usernameLocal));
      setShowUsernameModal(false);
      Alert.alert("Success", "Username updated successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.data?.error || "Failed to update username. Please try again.");
    }
  }, [usernameLocal, updateUsername, dispatch]);

  const savePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Invalid password", "Password must be at least 6 characters long.");
      return;
    }

    try {
      await updatePassword({ 
        currentPassword, 
        newPassword 
      }).unwrap();
      
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password updated successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.data?.error || "Failed to update password. Please try again.");
    }
  }, [currentPassword, newPassword, confirmPassword, updatePassword]);

  const Row = useCallback(({ icon, label, onPress, showArrow = true }: any) => (
    <TouchableOpacity 
      onPress={onPress} 
      className={`flex-row items-center justify-between p-5 mx-1 mb-3 rounded-2xl border ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-white/5' 
          : 'bg-white border-gray-200 shadow-black/5'
      } shadow-sm active:scale-98 transition-transform`}
    >
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
          isDarkMode ? 'bg-white' : 'bg-black'
        }`}>
          {React.cloneElement(icon, { 
            color: isDarkMode ? '#000000' : '#FFFFFF',
            size: 22 
          })}
        </View>
        <Text className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          {label}
        </Text>
      </View>
      {showArrow && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
        />
      )}
    </TouchableOpacity>
  ), [isDarkMode]);

  const ModalWrapper = useCallback(({ visible, onClose, children, title }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable
          onPress={onClose}
          className="flex-1 justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <Pressable
            className={`rounded-3xl p-6 mx-2 ${
              isDarkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-100'
            } shadow-2xl`}
            style={{
              shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: isDarkMode ? 0.1 : 0.25,
              shadowRadius: 25,
              elevation: 25,
            }}
          >
            <Text className={`text-2xl font-bold text-center mb-6 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              {title}
            </Text>
            {children}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  ), [isDarkMode]);

  const InputField = useCallback(({ 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1
  }: any) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`rounded-2xl p-4 mb-5 text-lg border-2 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-gray-50 border-gray-200 text-black'
      } font-medium`}
      style={{
        textAlignVertical: multiline ? "top" : "center",
        minHeight: multiline ? 120 : 56,
      }}
    />
  ), [isDarkMode]);

  const Button = useCallback(({ onPress, title, variant = "primary" }: any) => {
    const isLoading = isUpdatingUsername || isUpdatingBio || isUpdatingPassword;
    
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isLoading}
        className={`rounded-2xl py-4 px-6 mb-3 items-center active:scale-95 transition-transform ${
          variant === "primary" 
            ? (isDarkMode ? 'bg-white' : 'bg-black')
            : (isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200')
        } ${isLoading ? 'opacity-70' : 'opacity-100'}`}
      >
        {isLoading ? (
          <ActivityIndicator 
            color={variant === "primary" ? (isDarkMode ? '#000000' : '#FFFFFF') : (isDarkMode ? '#FFFFFF' : '#000000')} 
            size="small"
          />
        ) : (
          <Text className={`text-lg font-bold ${
            variant === "primary" 
              ? (isDarkMode ? 'text-black' : 'text-white')
              : (isDarkMode ? 'text-white' : 'text-black')
          }`}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }, [isDarkMode, isUpdatingUsername, isUpdatingBio, isUpdatingPassword]);

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <ScrollView className="px-5 pt-16">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            } shadow-sm active:scale-95 transition-transform`}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDarkMode ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
          <Text className={`text-3xl font-black ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Settings
          </Text>
          <View className="w-12" />
        </View>

        {/* Profile Section */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ml-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            PROFILE
          </Text>
          
          <Row
            icon={<MaterialIcons name="person-outline" />}
            label="Edit Username"
            onPress={() => setShowUsernameModal(true)}
          />

          <Row
            icon={<Feather name="edit-3" />}
            label="Edit Bio"
            onPress={() => setShowBioModal(true)}
          />
        </View>

        {/* Security Section */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ml-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            SECURITY
          </Text>
          
          <Row
            icon={<Ionicons name="lock-closed-outline" />}
            label="Change Password"
            onPress={() => setShowPasswordModal(true)}
          />
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ml-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            PREFERENCES
          </Text>
          
          {/* Theme Toggle */}
          <View className={`flex-row items-center justify-between p-5 mx-1 mb-3 rounded-2xl border ${
            isDarkMode 
              ? 'bg-black border-gray-800' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                isDarkMode ? 'bg-white' : 'bg-black'
              }`}>
                <Feather 
                  name={isDarkMode ? "sun" : "moon"} 
                  size={22} 
                  color={isDarkMode ? '#000000' : '#FFFFFF'} 
                />
              </View>
              <Text className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={handleToggleTheme}
              trackColor={{ 
                false: isDarkMode ? '#374151' : '#E5E7EB', 
                true: isDarkMode ? '#FFFFFF' : '#000000' 
              }}
              thumbColor={isDarkMode ? '#000000' : '#FFFFFF'}
              ios_backgroundColor={isDarkMode ? '#374151' : '#E5E7EB'}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={logoutHandler} 
          className={`flex-row items-center justify-center p-5 mx-1 mb-10 rounded-2xl border border-red-200 ${
            isDarkMode ? 'bg-red-950' : 'bg-red-50'
          } shadow-sm active:scale-95 transition-transform`}
        >
          <MaterialIcons 
            name="logout" 
            size={22} 
            color={isDarkMode ? '#F87171' : '#DC2626'} 
          />
          <Text className={`text-lg font-bold ml-3 ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Password Change Modal */}
      <ModalWrapper visible={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="🔒 Change Password">
        <InputField
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current Password"
          secureTextEntry={true}
        />
        <InputField
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry={true}
        />
        <InputField
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry={true}
        />
        <Button onPress={savePassword} title="Update Password" />
        <Button onPress={() => setShowPasswordModal(false)} title="Cancel" variant="secondary" />
      </ModalWrapper>

      {/* Bio Edit Modal */}
      <ModalWrapper visible={showBioModal} onClose={() => setShowBioModal(false)} title="✏️ Edit Bio">
        <InputField
          value={bioLocal}
          onChangeText={setBioLocal}
          placeholder="Tell us about yourself..."
          multiline={true}
          numberOfLines={4}
        />
        <Button onPress={saveBio} title="Save Bio" />
        <Button onPress={() => setShowBioModal(false)} title="Cancel" variant="secondary" />
      </ModalWrapper>

      {/* Username Edit Modal */}
      <ModalWrapper visible={showUsernameModal} onClose={() => setShowUsernameModal(false)} title="👤 Edit Username">
        <InputField
          value={usernameLocal}
          onChangeText={setUsernameLocal}
          placeholder="Choose a unique username"
        />
        <Button onPress={saveUsername} title="Save Username" />
        <Button onPress={() => setShowUsernameModal(false)} title="Cancel" variant="secondary" />
      </ModalWrapper>
    </View>
  );
}
