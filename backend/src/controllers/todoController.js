const Todo = require("../models/todoModel");

// Add a todo
exports.addTodo = async (req, res) => {
  const userIdFromToken = req.user.id; 
  const {title, description, priority, due_date } = req.body;

  try {
    const todo = await Todo.addTodo(userIdFromToken, title, description, priority, due_date);
    res.status(201).json({ message: "Todo added successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get todos by user ID
exports.getTodos = async (req, res) => {
  const userIdFromToken = req.user.id; 

  try {
    const todos = await Todo.getTodosByUserId(userIdFromToken);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted, priority, due_date } = req.body;

  try {
    await Todo.updateTodo(id, title, description, isCompleted, priority, due_date);
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a todo

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.deleteTodo(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
