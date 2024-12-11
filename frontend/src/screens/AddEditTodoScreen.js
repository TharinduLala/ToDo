import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { SegmentedButtons, Button, TextInput, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

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

  const handleSave = () => {
    const todoData = { title, description, priority, due_date: dueDate };

    if (isEdit) {
      console.log(todoData);

      // Update existing To-Do
      // axios
      //   .put(`http://your-backend-url/api/todos/${route.params.todo.id}`, todoData)
      //   .then(() => {
      //     alert('To-Do updated successfully!');
      //     navigation.goBack();
      //   })
      //   .catch((error) => {
      //     alert('Error updating To-Do');
      //   });
    } else {
      // Create a new To-Do
      console.log("Add", todoData);

      // axios
      //   .post('http://your-backend-url/api/todos', todoData)
      //   .then(() => {
      //     alert('To-Do created successfully!');
      //     navigation.goBack();
      //   })
      //   .catch((error) => {
      //     alert('Error creating To-Do');
      //   });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='headlineLarge'>{isEdit ? "Edit To-Do" : "Add To-Do"}</Text>
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
        // ,{height:120,textAlignVertical: 'top',}
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
    
  },
  title: {
    justifyContent:"center",
    textAlign:"center",
    marginBottom:10
  },
  input: {
    marginVertical: 20,
  },
  inputContainer:{
    display: "flex",
    flexDirection:"column",
  }
});
