const db = require("../config/db");
const uuid = require("uuid");
const {format } = require('date-fns');

class Todo {
  constructor(id, title, description, is_completed, priority, due_date, user_id, created_at) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.is_completed = is_completed;
    this.priority = priority;
    this.due_date = due_date;
    this.user_id = user_id;
    this.created_at = created_at;
  }

  static async addTodo(user_id, title, description, priority, due_date) {
    const id = uuid.v4(); // Generate a unique ID for todo
    
    const created_at = format(new Date().toString('en-GB'), 'yyyy-MM-dd HH:mm:ss');
    console.log(created_at);
    
    const dueDate = format(due_date, 'yyyy-MM-dd');
    
    const query =
      "INSERT INTO todos (id, title, description, is_completed, priority, due_date, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      const [result] = await db.query(query, [
        id,
        title,
        description,
        0,
        priority,
        dueDate,
        user_id,
        created_at,
      ]);
      return new Todo(id, title, description, 0, priority, due_date, user_id, created_at);
    } catch (error) {
      throw error;
    }
  }

  static async getTodosByUserId(user_id) {
    const query = "SELECT * FROM todos WHERE user_id = ?";
    try {
      const [rows] = await db.query(query, [user_id]);
      return rows.map(
        (row) =>
          new Todo(
            row.id,
            row.title,
            row.description,
            row.is_completed,
            row.priority,
            format(row.due_date, 'yyyy-MM-dd'),
            row.user_id,
            format(row.created_at, 'yyyy-MM-dd HH:mm:ss'),
          )
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateTodo(id, title, description, is_completed, priority, due_date) {
    const dueDate = format(due_date, 'yyyy-MM-dd');
    const query =
      "UPDATE todos SET title = ?, description = ?, is_completed = ?, priority = ?, due_date = ? WHERE id = ?";

    try {
      await db.query(query, [title, description, is_completed, priority, dueDate, id]);
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoStatus(id, is_completed) {
    
    const query =
      "UPDATE todos SET is_completed = ? WHERE id = ?";

    try {
      await db.query(query, [is_completed,id]);
    } catch (error) {
      throw error;
    }
  }

  static async deleteTodo(id) {
    const query = "DELETE FROM todos WHERE id = ?";
    try {
      await db.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Todo;
