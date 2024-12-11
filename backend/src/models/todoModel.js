const db = require("../config/db");
const uuid = require("uuid");
const { parse,format } = require('date-fns');

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
    const created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
    const query =
      "INSERT INTO todos (id, title, description, is_completed, priority, due_date, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      const [result] = await db.query(query, [
        id,
        title,
        description,
        0,
        priority,
        due_date,
        user_id,
        created_at,
      ]);
      return new Todo(id, title, description, 0, priority, due_date, user_id, created_at); // Return the new todo
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
    const query =
      "UPDATE todos SET title = ?, description = ?, is_completed = ?, priority = ?, due_date = ? WHERE id = ?";

    try {
      await db.query(query, [title, description, is_completed, priority, due_date, id]);
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
