const Todo = require("../models/todoModel");

// Add a todo
exports.addTodo = async (req, res) => {
  const userIdFromToken = req.user.id; 
  
  const {title, description, priority, due_date } = req.body;
console.log(title, description, priority, due_date);

  try {
    const todo = await Todo.addTodo(userIdFromToken, title, description, priority, due_date);
    res.status(201).json({ message: "Todo added successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getTodos = async (req, res) => {
  const userIdFromToken = req.user.id; 

  try {
    const todos = await Todo.getTodosByUserId(userIdFromToken);
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted, priority, due_date } = req.body;

  try {
    await Todo.updateTodo(id, title, description, isCompleted, priority, due_date);
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTodoStatus = async (req, res) => {
  const { id } = req.params;
  const {isCompleted} = req.body;

  try {
    await Todo.updateTodoStatus(id, isCompleted);
    res.status(200).json({ message: "Todo status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete a todo
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.deleteTodo(id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
