import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import axios from "axios";
import { FAB, Portal, PaperProvider, Text, Chip } from "react-native-paper";
import MyModal from "../components/MyModal";
import ToDoCard from "../components/ToDoCard";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

export default function ToDoDashboard({ navigation }) {
  const [todos, setTodos] = useState([]); // All todos from the server
  const [todoFilter, setTodoFilter] = useState("All"); // Current filter ("All", "Completed", "Pending")
  const [filteredTodos, setFilteredTodos] = useState([]); // Filtered todos based on the selected date and filter
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Date selected in calendar

  const showModal = (todo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  useEffect(() => {
    // Apply filtering logic when todos or selectedDate or todoFilter changes
    if (todos.length > 0) {
      const today = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");
      const dateToFilter = selectedDate || today; // Default to today's date if no date selected
      setFilteredTodos(filterToDos(todoFilter, dateToFilter));
    }
  }, [todos, selectedDate, todoFilter]); // Re-run the filter when any of these change

  const fetchTodos = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        alert("Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }
      const response = await axios.get(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(response.data);
      // Apply initial filter once todos are fetched
      const today = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");
      setSelectedDate(today); // Set today's date as default selected date
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("Error", "Failed to fetch todos");
    }
  };
  const confirmDelete = (todoId) => {
    // Show confirmation alert
    const confirm = window.confirm("Are you sure you want to delete this todo?");
  if (confirm) {
    deleteTodo(todoId);
  }
  };
  const renderTodo = ({ item }) => (
    <ToDoCard
      item={item}
      onPress={() => {
        showModal(item);
      }}
      onStatusChange={updateTodoStatus}
      onDelete={confirmDelete}
    />
  );

  const filterToDosByDate = (date) => {
    return todos.filter((item) => item.due_date === date);
  };

  const filterToDos = (filter, date) => {
    let filteredByDate = filterToDosByDate(date);
    switch (filter) {
      case "Completed":
        return filteredByDate.filter((todo) => todo.is_completed);
      case "Pending":
        return filteredByDate.filter((todo) => !todo.is_completed);
      default:
        return filteredByDate;
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        alert("Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }

      // Send DELETE request to API to delete the todo
      const response = await axios.delete(`${API_URL}/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Todo deleted successfully!");
        // Remove the deleted todo from state

        setTodos(todos.filter((todo) => todo.id !== todoId));
        setFilteredTodos(filteredTodos.filter((todo) => todo.id !== todoId));
      } else {
        alert("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Error", "Failed to delete todo");
    }
  };

  const updateTodoStatus = async (todoId, status) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        alert("Session expired. Please log in again.");
        navigation.replace("Login");
        return;
      }

      const updatedTodo = {
        isCompleted: status, // Update status (true/false)
      };

      // Make PUT request to update the todo status
      const response = await axios.put(`${API_URL}/todos/status/${todoId}`, updatedTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(response.data.message);
        // Update the todos directly in state after status change
        setTodos((prevTodos) => {
          return prevTodos.map((todo) =>
            todo.id === todoId ? { ...todo, is_completed: status } : todo
          );
        });
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Error", "Failed to update todo status");
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={{ marginTop: 0, paddingTop: 0 }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: "#7845ac" },
        }}
        enableSwipeMonths={true}
        hideExtraDays={true}
        showWeekNumbers={true}
      />
      <View style={styles.chipContainer}>
        <Chip mode='flat' selected={todoFilter === "All"} onPress={() => setTodoFilter("All")}>
          All
        </Chip>
        <Chip
          mode='flat'
          selected={todoFilter === "Completed"}
          onPress={() => setTodoFilter("Completed")}
        >
          Completed
        </Chip>
        <Chip
          mode='flat'
          selected={todoFilter === "Pending"}
          onPress={() => setTodoFilter("Pending")}
        >
          Pending
        </Chip>
      </View>
      <PaperProvider>
        <Portal>
          <FlatList
            style={styles.todoContainer}
            data={filteredTodos}
            renderItem={filteredTodos.length > 0 ? renderTodo : null}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", justifyContent: "center" }}
                variant='headlineMedium'
              >
                No Activities!
              </Text>
            }
          />

          <FAB icon='plus' style={styles.fab} onPress={() => navigation.navigate("AddEditTodo")} />
        </Portal>
      </PaperProvider>
      <MyModal visible={modalVisible} hideModal={hideModal} todo={selectedTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ffffff" },
  todoContainer: { marginBottom: 20, marginTop: 10 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  chipContainer: {
    marginTop: 10,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
});
