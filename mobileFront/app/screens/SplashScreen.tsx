import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Auth"); 
    }, 1000);  

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/memo.png")} style={styles.logo} />
      <Text style={styles.text}>TrackIt</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 220,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: -25,
  },
  text: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
  },
});
