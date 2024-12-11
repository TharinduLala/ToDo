import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import axios from "axios";
import { FAB, Portal, PaperProvider, Text, Chip } from "react-native-paper";
import MyModal from "../components/MyModal";
import ToDoCard from "../components/ToDoCard";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function ToDoDashboard({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [todoFilter, setTodoFilter] = useState("All");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // await AsyncStorage.getItem("userToken")

  const showModal = (todo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        alert("Authentication Error", "User not authenticated");
        navigation.replace("Login");
        return;
      }
      const response = await axios.get(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const today = new Date().toISOString().split("T")[0];
      setTodos(response.data);
      
      setFilteredTodos(response.data.filter((item) => item.due_date == today));
      setSelectedDate(today)
      
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("Error", "Failed to fetch todos");
    }
  };

  const renderTodo = ({ item }) => (
    <ToDoCard
      item={item}
      onPress={() => {
        showModal(item);
      }}
      onStatusChange={updateTodoStatus}
    ></ToDoCard>
  );

  const filterToDosByDate = (date) => {
    return(todos.filter((item) => item.due_date == date));
  };

  const filterToDos = (newFilter,date) => {
    
    setTodoFilter(newFilter)
    let temp=filterToDosByDate(date);
    
    switch (newFilter) {
      case "Completed":
        setFilteredTodos(temp.filter((todo) => todo.is_completed))
        break;
      case "Pending":
        setFilteredTodos(temp.filter((todo) => !todo.is_completed))
        break;
      default:setFilteredTodos(temp)
        break;
    }
  };

  const updateTodoStatus = (todoId, status) => {
    console.log(todoId + " " + status);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          filterToDos(todoFilter,day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: "#7845ac" },
        }}
        enableSwipeMonths={true}
        hideExtraDays={true}
        showWeekNumbers={true}
      />
      <View style={styles.chipContainer}>
        <Chip mode='flat' selected={todoFilter === "All"} onPress={() => filterToDos("All",selectedDate)}>
          All
        </Chip>
        <Chip
          mode='flat'
          selected={todoFilter === "Completed"}
          onPress={() => filterToDos("Completed",selectedDate)}
        >
          Completed
        </Chip>
        <Chip
          mode='flat'
          selected={todoFilter === "Pending"}
          onPress={() => filterToDos("Pending",selectedDate)}
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
