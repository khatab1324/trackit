import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const SplashScreen = ({ navigation }: any) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && token) {
        navigation.replace("Home");
      } else {
        navigation.replace("Auth");
      }
    }, 500);  

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, token]);

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
