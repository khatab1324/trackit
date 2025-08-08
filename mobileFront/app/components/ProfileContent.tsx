import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Memory } from "../core/types/memory";
import { colors } from "../core/theme/colors";
import MemoryThumbnail from "../components/MemoryThumbnail";
import { RootState } from "../store";
import { useSelector } from "react-redux";

export default function ProfileContent({ memories: memoriesList, saved: savedList }: { memories: Memory[] | null, saved: Memory[] | null }) {
    const isDark = useSelector(
        (state: RootState) => state.sheardDataThrowApp.darkMode
    );
    const colorScheme = isDark ? colors.dark : colors.light;
    
    const [activeTab, setActiveTab] = useState(0);

    const tabsList = [
        {
            name: "Memories",
            data: memoriesList
        },
        {
            name: "Saved",
            data: savedList
        }
    ];

    return (
        <View className="flex-1">
            < View className={`flex-row justify-around border-b mb-4`
            } style={{ borderColor: colorScheme.border }}>
                {
                    tabsList.map((tab, index) => (
                        <TouchableOpacity key={tab.name} onPress={() => setActiveTab(index)}>
                            <Text
                                className={`pb-2 ${activeTab === index ? `border-b-2 font-semibold` : ``}`}
                                style={{ color: activeTab === index ? colorScheme.primary : colorScheme.primary, borderColor: colorScheme.primary }}
                            >
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View >

            {
                tabsList[activeTab].data?.length ? (
                    <FlatList
                        data={tabsList[activeTab].data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }: { item: Memory }) => <MemoryThumbnail item={item} />}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Text className={`text-center mt-10`} style={{ color: colorScheme.secondaryText }}>
                        No memories found.
                    </Text>
                )
            }
        </View>
    );
}

const styles = {}