const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const chatRouter = require("./routes/chat");  // connects chat.js router

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/lifetrack")
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(err => console.log("MongoDB Error:", err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("LifeTrack backend is running 🚀");
});

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "Account created successfully ✅" });
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Email not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  res.status(200).json({ message: "Login successful ✅" });
});

// CHAT ROUTE, this is the key line that connects chat.js
app.use("/chat", chatRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});
