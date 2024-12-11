const User = require("../models/userModel");

// Register user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.register(name, email, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user || !(await User.verifyPassword(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await User.generateAuthToken(user);
    res.json({ message: "Login successful",token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
