const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const chatRouter = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lifetrack")
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => res.send("LifeTrack running 🚀"));

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });
    const hashed = await bcrypt.hash(password, 10);
    await new User({ email, password: hashed }).save();
    res.status(201).json({ message: "Account created successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password." });
    res.status(200).json({ message: "Login successful ✅" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.use("/chat", chatRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000 🚀"));