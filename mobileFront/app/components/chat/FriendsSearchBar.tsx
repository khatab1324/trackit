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
  className = "",
  emptyText = "No friends found",
  loadingText = "Loading friends...",
}) => {
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const { data: followers, isLoading } = useGetCurrentUserFollowersQuery();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  //TODO: make hook for debounce
  const [debounced, setDebounced] = useState(query);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(query), 250);
  }, [query]);

  const renderItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      className="px-3 py-2"
      onPress={() => {
        onSelect?.(item);
        Keyboard.dismiss();
        setFocused(false);
      }}
    >
      <Text className={`text-sm font-medium `}>
        {item.username || "Unknown"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className={`w-full ${className}`}>
      <View className={`flex-row items-center rounded-xl px-3 h-12`}>
        <Ionicons
          name="search"
          size={18}
          color={isDark ? "#9CA3AF" : "#6B7280"}
        />
        <TextInput
          className={`flex-1 ml-2 text-base `}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setTimeout(() => setFocused(false), 120);
          }}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons
              name="close"
              size={18}
              color={isDark ? "#9CA3AF" : "#6B7280"}
            />
          </TouchableOpacity>
        )}
      </View>

      {focused && (
        <View className={`mt-1 rounded-xl  border  max-h-72 overflow-hidden`}>
          {isLoading ? (
            <View className="py-6 items-center">
              <ActivityIndicator />
              <Text className={`mt-2 text-xs `}>{loadingText}</Text>
            </View>
          ) : !followers || followers.length === 0 ? (
            <View className="py-6 items-center">
              <Text className={`text-xs `}>{emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={followers}
              keyExtractor={(f) => f.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => (
                <View
                  className={`h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                />
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
