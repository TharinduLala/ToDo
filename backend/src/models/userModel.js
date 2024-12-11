const db = require("../config/db");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async register(name, email, password) {
    const id = uuid.v4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";

    try {
      const [result] = await db.query(query, [id, name, email, hashedPassword]);
      return new User(id, name, email, hashedPassword); // Return the new user
    } catch (error) {
      throw error;
    }
  }

  static async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    try {
      const [rows] = await db.query(query, [email]);
      return rows[0] ? new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password) : null;
    } catch (error) {
      throw error;
    }
  }

  static async generateAuthToken(user) {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return token;
  }

  static async verifyPassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }
}

module.exports = User;
