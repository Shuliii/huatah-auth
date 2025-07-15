const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");
const User = require("./util/userModel");

// dotenv.config();
const PORT = process.env.PORT || 8081;

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  console.log("test successful");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findUser(username);
    if (userExists)
      return res.status(400).json({ message: "Username already taken" });

    const result = await User.createUser(username, password);
    return res.status(201).json({
      message: "User created successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findUser(username);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.isActive !== "1")
      return res
        .status(400)
        .json({ message: "Please ask admins to activate the account!" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });
    res.status(200).json({ token, isActive: user.isActive });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
});

app.post("/changepassword", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findUser(username);
    if (!user) return res.status(400).json({ message: "Username not found" });
    await User.changePassword(username, password);
    return res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
