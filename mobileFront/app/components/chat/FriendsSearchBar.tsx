import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetCurrentUserFollowersQuery } from "../../lib/APIs/RTKQuery/InteractionApi";
import { Friend } from "../../core/types/friends";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "../../hooks/useThemeColors";

type FriendsSearchBarProps = {
  onSelect?: (friend: Friend) => void;
  placeholder?: string;
  autoFocus?: boolean;
  emptyText?: string;
  loadingText?: string;
};

export const FriendsSearchBar: React.FC<FriendsSearchBarProps> = ({
  onSelect,
  placeholder = "Search friends...",
  autoFocus = false,
  emptyText = "No friends found",
  loadingText = "Loading friends...",
}) => {
  const themeColors = useThemeColors();

  const { data: followers, isLoading } = useGetCurrentUserFollowersQuery();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const [debounced, setDebounced] = useState(query);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(query), 250);
  }, [query]);

  const filteredFollowers = useMemo(() => {
    if (!debounced.trim()) return followers || [];
    return (followers || []).filter((f) =>
      f.username?.toLowerCase().includes(debounced.toLowerCase())
    );
  }, [debounced, followers]);

  const renderItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={{ paddingHorizontal: 12, paddingVertical: 8 }}
      onPress={() => {
        onSelect?.(item);
        Keyboard.dismiss();
        setFocused(false);
      }}
    >
      <ThemedText className="text-sm font-medium">
        {item.username || "Unknown"}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={{ width: "100%" }}>
      <View
        className="flex-row items-center rounded-xl px-3 h-12 bg-card"
      >
        <Ionicons name="search" size={18} color={themeColors.placeholder} />
        <TextInput
          className="flex-1 ml-2 text-base"
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={themeColors.placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close" size={18} color={themeColors.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {focused && (
        <View
          className="mt-1 rounded-xl border border-border bg-card max-h-72 overflow-hidden"
        >
          {isLoading ? (
            <View className="py-5 items-center">
              <ActivityIndicator color={themeColors.text} />
              <ThemedText type="placeholder" className="mt-2 text-xs">
                {loadingText}
              </ThemedText>
            </View>
          ) : filteredFollowers.length === 0 ? (
            <View className="py-5 items-center">
              <ThemedText type="placeholder" className="text-xs">
                {emptyText}
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={filteredFollowers}
              keyExtractor={(f) => f.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border" />
              )}
              style={{ maxHeight: 288 }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default FriendsSearchBar;
