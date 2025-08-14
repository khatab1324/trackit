import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

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
              <Ionicons name="shield-outline" size={22} color="#111827" style={styles.icon} />
              <Text style={styles.itemText}>Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => setMode("edit")}>
              <MaterialIcons name="edit" size={22} color="#111827" style={styles.icon} />
              <Text style={styles.itemText}>Edit Caption</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={() => setMode("delete")}>
              <Feather name="trash-2" size={22} color="#EF4444" style={styles.icon} />
              <Text style={[styles.itemText, { color: "#EF4444" }]}>Delete</Text>
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
              <Text style={styles.privacyOption}>🌍 Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                onTogglePrivacy(true);
                closeMenu();
              }}
            >
              <Text style={styles.privacyOption}>🔒 Private</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === "edit" && (
          <>
            <Text style={styles.label}>Edit caption</Text>
            <TextInput
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
              placeholder="Enter a new caption"
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#2563EB", flex: 1, marginRight: 6 }]}
                onPress={() => {
                  onUpdateCaption(caption.trim());
                  closeMenu();
                }}
              >
                <Text style={styles.actionBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#9CA3AF", flex: 1, marginLeft: 6 }]}
                onPress={closeMenu}
              >
                <Text style={styles.actionBtnText}>Cancel</Text>
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
              <Feather name="trash-2" size={22} color="#EF4444" style={styles.icon} />
              <Text style={[styles.itemText, { color: "#EF4444" }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={closeMenu}>
              <Ionicons name="close-circle" size={22} color="#DC2626" style={styles.icon} />
              <Text style={[styles.itemText, { color: "#111827" }]}>Cancel</Text>
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  icon: { marginRight: 12 },
  itemText: { fontSize: 16, color: "#111827" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  label: { fontSize: 16, color: "#111827", marginBottom: 8, fontWeight: "600" },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    color: "#111827",
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  privacyOption: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 4,
  },
});
