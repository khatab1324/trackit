import React, { PropsWithChildren, useMemo } from "react";
import { View, useWindowDimensions, SafeAreaView, ScrollView } from "react-native";

const BP = { md: 600, lg: 1024 };                         
const MAX_WIDTH = { phone: 420, tablet: 700, large: 900 }; 

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  if (width >= BP.lg) return "lg";
  if (width >= BP.md) return "md";
  return "sm";
}

export function ResponsiveContainer({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const bp = useBreakpoint();

  const contentWidth = useMemo(() => {
    if (bp === "lg") return Math.min(width, MAX_WIDTH.large);
    if (bp === "md") return Math.min(width, MAX_WIDTH.tablet);
    return Math.min(width, MAX_WIDTH.phone);
  }, [width, bp]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 items-center">
        <View style={{ width: contentWidth }} className="flex-1">
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

export function Screen({ children }: PropsWithChildren) {
  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ResponsiveContainer>
  );
}

export function Feed({ children }: PropsWithChildren) {
  return (
    <ResponsiveContainer>
      <View className="flex-1">{children}</View>
    </ResponsiveContainer>
  );
}
