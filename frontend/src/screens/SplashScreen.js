import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      checkLogin();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      navigation.replace("Dashboard");
    } else {
      navigation.replace("Login");
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require("../assets/splash.jpg")} style={styles.logo} />
      <Text style={styles.title}>Welcome to ToDo App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});
