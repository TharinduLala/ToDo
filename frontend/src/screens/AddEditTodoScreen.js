import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { SegmentedButtons, Button, TextInput, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddEditTodoScreen({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (route.params?.todo) {
      const { title, description, priority, due_date } = route.params.todo;
      setTitle(title);
      setDescription(description);
      setPriority(priority.toString());
      setDueDate(new Date(due_date));
      setIsEdit(true);
    }
  }, [route.params]);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigation.replace("Login");
      return;
    }
    if (isEdit) {
      const originalTodo = route.params.todo;
      const todoData = {
        title,
        description,
        isCompleted: originalTodo.is_completed,
        priority,
        due_date: dueDate,
      };
      const hasChanges =
        title !== originalTodo.title ||
        description !== originalTodo.description ||
        priority !== originalTodo.priority.toString() ||
        dueDate?.toISOString() !== new Date(originalTodo.due_date)?.toISOString();
      if (!hasChanges) {
        alert("No changes detected.");
        return;
      }
      try {
        const response = await axios.put(
          `${API_URL}/todos/${originalTodo.id}`,
          todoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert(response.data.message);
          console.log("To-Do updated successfully:", response.data);
          navigation.goBack();
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        if (error.response) {
          console.error("Server error:", error.response.status, error.response.data.message);
        } else {
          console.error("Error:", error.message);
        }
      }
    } else {
      const todoData = { title, description, priority, due_date: dueDate };
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.post(`${API_URL}/todos`, todoData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          alert(response.data.message);
          console.log(response.data.message);
          setTitle("");
          setDescription("");
          setPriority("Medium");
          setDueDate("");
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        if (error.response) {
          console.error("Server error:", error.response.status, error.response.data.message);
        } else {
          console.error("Error:", error.message);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='headlineLarge'>
        {isEdit ? "Edit To-Do" : "Add To-Do"}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} label='Title' value={title} onChangeText={setTitle} />

        <SegmentedButtons
          style={styles.input}
          value={priority}
          onValueChange={setPriority}
          buttons={[
            {
              value: "High",
              label: "High",
              checkedColor: "#FF0000",
              theme: "background",
            },
            {
              value: "Medium",
              label: "Medium",
              theme: "background",
              checkedColor: "#ffff00",
            },
            { value: "Low", label: "Low", checkedColor: "#00ff00", theme: "background" },
          ]}
        />
        <DatePickerInput
          style={styles.input}
          locale='en-GB'
          label='Due Date'
          value={dueDate}
          onChange={setDueDate}
          inputMode='start'
        />
        <TextInput
          style={[styles.input]}
          multiline={true}
          numberOfLines={6}
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
        />
        <Button mode='contained' onPress={handleSave}>
          {isEdit ? "Update To-Do" : "Save To-Do"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    marginVertical: 20,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
});
