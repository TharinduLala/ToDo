import React, { useState } from "react";
import { View, TextInput,StyleSheet} from "react-native";
import { Button, Text } from "react-native-paper";
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
     alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      const {token } = response.data;

      if (token) {
        await AsyncStorage.setItem("userToken", token);
        navigation.replace("Dashboard");
      } else {
        alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login Failed", "An error occurred while logging in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='headlineLarge'>
        Login
      </Text>
      <TextInput
        placeholder='Email'
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        placeholder='Password'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode='contained' onPress={handleLogin} buttonColor='#2d00f7'>
        Login
      </Button>
      <Text style={styles.title} variant='labelMedium'>
        Didn't have Account?{" "}
        <Button textColor='#2d00f7' mode='text' onPress={() => navigation.navigate("Register")}>
          Register
        </Button>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
