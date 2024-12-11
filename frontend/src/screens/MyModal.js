import React from "react";
import { Modal, Card, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";

const MyModal = ({ visible, hideModal, todo }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Card>
        <Card.Title titleNumberOfLines={2} title={todo.title} />
        <Card.Content>
          <Text>{todo.description}</Text>
        </Card.Content>
        <Card.Actions>
          <Text>Due Date: {todo.due_date}</Text>
          <Button onPress={hideModal}>Close</Button>
        </Card.Actions>
      </Card>
    </Modal>
  );
};
const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: "transparent",
    padding: 20,
  },
});
export default MyModal;
