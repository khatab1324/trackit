import React, { Fragment, useEffect } from "react";
import { Marker } from "react-native-maps";
import { useGetMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { View } from "react-native";

export const RenderMemoryOnMap = () => {
  const {
    data = [],
    isLoading,
    isSuccess,
  } = useGetMemoriesQuery();

  if (isLoading) {
    console.log("Still loading memories...");
    return null;
  }

  if (!isSuccess || data.length === 0) {
    console.log("No memories to display");
    return null;
  }

  return (
    <View>
      {data.map((m) => (
        <Marker
          key={`memory-${m.id}`}
          coordinate={{ latitude: m.lang, longitude: m.long }}
          title={"Memory"}
          description={m.description ?? "No description"}
          pinColor="red"
        />
      ))}
    </View>
  );
};
