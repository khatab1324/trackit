import React from "react";
import { ScrollView, View } from "react-native";
import FilterChip from "./FilterChip";
import type { FilterKey } from "./CameraFilterOverlay";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "none", label: "Original" },
  { key: "warm", label: "Warm Glow" },
  { key: "cool", label: "Cool" },
  { key: "sepia", label: "Sepia" },
  { key: "rose", label: "Rose" },
  { key: "dramatic", label: "Dramatic" },
];

type Props = {
  value: FilterKey;
  onChange: (f: FilterKey) => void;
};

export default function FilterCarousel({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <View className="flex-row items-center gap-8">
        {FILTERS.map((f) => (
          <FilterChip
            key={f.key}
            value={f.key}
            label={f.label}
            active={value === f.key}
            onPress={() => onChange(f.key)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
