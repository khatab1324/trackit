import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
  visible: boolean;
  onClose: () => void;
  isPrivate: boolean;
  currentCaption: string;
  onTogglePrivacy: (next: boolean) => void;
  onUpdateCaption: (newCaption: string) => void;
  onDelete: () => void;
};

export default function MemoryOptionsMenu({
  visible,
  onClose,
  isPrivate,
  currentCaption,
  onTogglePrivacy,
  onUpdateCaption,
  onDelete,
}: Props) {
  const [mode, setMode] = useState<"menu" | "edit" | "privacy" | "delete">("menu");
  const [caption, setCaption] = useState(currentCaption);
  const slideAnim = useState(new Animated.Value(300))[0];
  const themeColors = useThemeColors();

  useEffect(() => {
    if (visible) {
      setCaption(currentCaption);
      setMode("menu");
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, currentCaption]);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={closeMenu}>
      <Pressable style={styles.backdrop} onPress={closeMenu} />
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />

        {mode === "menu" && (
          <>
            {/* Privacy */}
            <TouchableOpacity style={styles.row} onPress={() => setMode("privacy")}>
              <Ionicons name="shield-outline" size={22} color={themeColors.text} style={styles.icon} />
              <ThemedText style={styles.itemText}>Privacy</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => setMode("edit")}>
              <MaterialIcons name="edit" size={22} color={themeColors.text} style={styles.icon} />
              <ThemedText style={styles.itemText}>Edit Caption</ThemedText>
            </TouchableOpacity>

            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={() => setMode("delete")}>
              <Feather name="trash-2" size={22} color={themeColors.error} style={styles.icon} />
              <ThemedText style={[styles.itemText, { color: themeColors.error }]}>Delete</ThemedText>
            </TouchableOpacity>
          </>
        )}

        {mode === "privacy" && (
          <>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                onTogglePrivacy(false);
                closeMenu();
              }}
            >
              <ThemedText style={styles.privacyOption}>🌍 Public</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                onTogglePrivacy(true);
                closeMenu();
              }}
            >
              <ThemedText style={styles.privacyOption}>🔒 Private</ThemedText>
            </TouchableOpacity>
          </>
        )}

        {mode === "edit" && (
          <>
            <ThemedText style={styles.label}>Edit caption</ThemedText>
            <TextInput
              style={[styles.input, { color: themeColors.text }]} // Apply text color to TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Enter a new caption"
              placeholderTextColor={themeColors.placeholder}
              multiline
            />
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: themeColors.primary, flex: 1, marginRight: 6 }]}
                onPress={() => {
                  onUpdateCaption(caption.trim());
                  closeMenu();
                }}
              >
                <ThemedText style={styles.actionBtnText}>Save</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: themeColors.placeholder, flex: 1, marginLeft: 6 }]}
                onPress={closeMenu}
              >
                <ThemedText style={styles.actionBtnText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        )}

        {mode === "delete" && (
          <>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                onDelete();
                closeMenu();
              }}
            >
              <Feather name="trash-2" size={22} color={themeColors.error} style={styles.icon} />
              <ThemedText style={[styles.itemText, { color: themeColors.error }]}>Delete</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={closeMenu}>
              <Ionicons name="close-circle" size={22} color={themeColors.error} style={styles.icon} />
              <ThemedText style={[styles.itemText, { color: themeColors.text }]}>Cancel</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.card, // Use theme color
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
    elevation: 12,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: themeColors.border, // Use theme color
    alignSelf: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  icon: { marginRight: 12 },
  itemText: { fontSize: 16, color: themeColors.text }, // Use theme color
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: themeColors.border, // Use theme color
    marginVertical: 4,
  },
  label: { fontSize: 16, color: themeColors.text, marginBottom: 8, fontWeight: "600" }, // Use theme color
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: themeColors.border, // Use theme color
    borderRadius: 12,
    padding: 12,
    color: themeColors.text, // Set by component already
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 }, // This text is on a colored button, keep white
  privacyOption: {
    fontSize: 16,
    color: themeColors.text,
    fontWeight: "500",
    marginLeft: 4,
  },
});
