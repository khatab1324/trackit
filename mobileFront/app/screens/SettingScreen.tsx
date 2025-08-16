import React, { useState } from "react";
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

export function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isDarkMode = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const currentUser = useSelector((state: RootState) => state.user as any);

  const themeColors = isDarkMode ? colors.dark : colors.light;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bioLocal, setBioLocal] = useState<string>(currentUser?.bio ?? "");
  const [usernameLocal, setUsernameLocal] = useState<string>(
    currentUser?.username ?? ""
  );

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch(resetStore());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const saveBio = () => {
    dispatch(setBio(bioLocal));
    setShowBioModal(false);
    Alert.alert("Success", "Bio updated.");
  };

  const saveUsername = () => {
    if (!usernameLocal.trim()) {
      Alert.alert("Missing username", "Please enter a valid username.");
      return;
    }
    dispatch(setUsername(usernameLocal));
    setShowUsernameModal(false);
    Alert.alert("Success", "Username updated.");
  };

  const Row = ({ icon, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center mb-5">
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: themeColors.secondary,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        {icon}
      </View>
      <Text style={{ color: themeColors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  const ModalWrapper = ({ visible, onClose, children }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          style={{
            backgroundColor: themeColors.background,
            borderRadius: 16,
            padding: 20,
          }}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 56 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: themeColors.text }}>
            Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <Row
          icon={<Ionicons name="lock-closed-outline" size={22} color={themeColors.text} />}
          label="Edit Password"
          onPress={() => setShowPasswordModal(true)}
        />

        <Row
          icon={<Feather name="edit-3" size={22} color={themeColors.text} />}
          label="Edit Bio"
          onPress={() => setShowBioModal(true)}
        />

        <Row
          icon={<MaterialIcons name="person-outline" size={22} color={themeColors.text} />}
          label="Edit Username"
          onPress={() => setShowUsernameModal(true)}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: themeColors.secondary,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Feather name="moon" size={22} color={themeColors.text} />
            </View>
            <Text style={{ color: themeColors.text }}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={handleToggleTheme} />
        </View>

        <TouchableOpacity onPress={logoutHandler} style={{ flexDirection: "row", alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: themeColors.secondary,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <MaterialIcons name="logout" size={22} color={themeColors.text} />
          </View>
          <Text style={{ color: themeColors.text }}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <ModalWrapper visible={showBioModal} onClose={() => setShowBioModal(false)}>
        <Text style={{ color: themeColors.text, fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
          Edit Bio
        </Text>
        <TextInput
          value={bioLocal}
          onChangeText={setBioLocal}
          placeholder="Write your new bio..."
          placeholderTextColor={themeColors.secondaryText}
          multiline
          style={{
            backgroundColor: themeColors.secondary,
            color: themeColors.text,
            borderRadius: 12,
            padding: 10,
            marginBottom: 16,
          }}
        />
        <TouchableOpacity
          onPress={saveBio}
          style={{
            backgroundColor: themeColors.primary,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: themeColors.white, textAlign: "center" }}>Save</Text>
        </TouchableOpacity>
      </ModalWrapper>

      <ModalWrapper visible={showUsernameModal} onClose={() => setShowUsernameModal(false)}>
        <Text style={{ color: themeColors.text, fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
          Edit Username
        </Text>
        <TextInput
          value={usernameLocal}
          onChangeText={setUsernameLocal}
          placeholder="New username"
          placeholderTextColor={themeColors.secondaryText}
          style={{
            backgroundColor: themeColors.secondary,
            color: themeColors.text,
            borderRadius: 12,
            padding: 10,
            marginBottom: 16,
          }}
        />
        <TouchableOpacity
          onPress={saveUsername}
          style={{
            backgroundColor: themeColors.primary,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: themeColors.white, textAlign: "center" }}>Save</Text>
        </TouchableOpacity>
      </ModalWrapper>
    </View>
  );
}
