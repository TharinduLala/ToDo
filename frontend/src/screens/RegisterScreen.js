import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const url = `${API_URL}/users/register`;

      const response = await axios.post(url, { name, email, password });
      alert(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
        return;
      }
      console.error("Error registering:", error);
      alert("Error registering");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder='Name' style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder='Email' style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        placeholder='Password'
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
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
