import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
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
import { colors } from "../../core/theme/colors";

type FriendsSearchBarProps = {
  onSelect?: (friend: Friend) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
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
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const colorScheme = isDark ? colors.dark : colors.light;

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
      <Text style={{ color: colorScheme.text, fontSize: 14, fontWeight: "500" }}>
        {item.username || "Unknown"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 48,
          backgroundColor: colorScheme.secondary,
        }}
      >
        <Ionicons name="search" size={18} color={colorScheme.secondaryText} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            color: colorScheme.text,
          }}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={colorScheme.secondaryText}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close" size={18} color={colorScheme.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {focused && (
        <View
          style={{
            marginTop: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colorScheme.border,
            backgroundColor: colorScheme.background,
            maxHeight: 288,
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator color={colorScheme.text} />
              <Text style={{ color: colorScheme.secondaryText, marginTop: 8, fontSize: 12 }}>
                {loadingText}
              </Text>
            </View>
          ) : filteredFollowers.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <Text style={{ color: colorScheme.secondaryText, fontSize: 12 }}>
                {emptyText}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredFollowers}
              keyExtractor={(f) => f.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: colorScheme.border }} />
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
