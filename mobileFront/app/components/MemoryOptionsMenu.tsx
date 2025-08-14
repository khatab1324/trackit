// components/MemoryOptionsMenu.tsx
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
  const [mode, setMode] = useState<"menu" | "edit">("menu");
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
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.handle} />

        {mode === "menu" ? (
          <>
            {/* Make Private / Make Public */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                onTogglePrivacy(!isPrivate);
                closeMenu();
              }}
            >
              <Ionicons
                name={isPrivate ? "lock-open-outline" : "lock-closed-outline"}
                size={22}
                color="#111827"
                style={styles.icon}
              />
              <Text style={styles.itemText}>
                {isPrivate ? "Make Public" : "Make Private"}
              </Text>
            </TouchableOpacity>

            {/* Edit Caption */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => setMode("edit")}
            >
              <MaterialIcons name="edit" size={22} color="#111827" style={styles.icon} />
              <Text style={styles.itemText}>Edit Caption</Text>
            </TouchableOpacity>

            {/* Delete */}
            <View style={styles.divider} />
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
          </>
        ) : (
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
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                onUpdateCaption(caption.trim());
                closeMenu();
              }}
            >
              <Text style={styles.saveBtnText}>Save</Text>
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
  saveBtn: {
    backgroundColor: "#2563EB",
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
