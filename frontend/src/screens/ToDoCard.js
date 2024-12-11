import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, IconButton,Checkbox } from "react-native-paper";

const ToDoCard = ({ item, onPress ,onStatusChange}) => {
  const navigation=useNavigation();
  const [checked, setChecked] = useState(item.is_completed);
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return styles.high;
      case "Medium":
        return styles.medium;
      case "Low":
        return styles.low;
      default:
        return styles.default;
    }
  };
  const handleCheckboxPress = () => {
    const newStatus = !checked; // Toggle the status
    setChecked(newStatus); // Update the local state
    onStatusChange(item.id, newStatus); // Notify the parent to update the global state
  };
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Card style={[styles.cardContainer, getPriorityStyle(item.priority)]}>
        <Card.Title
        theme={{dark:false}}
          title={item.title}
          titleVariant="titleSmall"
          left={() => (
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={handleCheckboxPress}
            />
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <IconButton  icon='pencil' onPress={() => navigation.navigate("AddEditTodo",{todo:item})} />
              <IconButton  icon='delete' onPress={() => console.log("Delete pressed")} />
            </View>
          )}
          
        />
      </Card>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  high: { borderColor: "#FF000080" },
  medium: { borderColor: "#DEFF0A80" },
  low: { borderColor: "#0AFF9980" },
  cardContainer: {
    borderWidth: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ToDoCard;