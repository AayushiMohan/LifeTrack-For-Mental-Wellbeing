const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

// CREATE — new problem post
router.post("/", async (req, res) => {
  try {
    const { userEmail, category, title, description } = req.body;

    if (!userEmail || !category || !title || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const anonymousName = "User_" + Math.floor(1000 + Math.random() * 9000);

    const newProblem = new Problem({
      userEmail,
      anonymousName,
      category,
      title,
      description
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem posted successfully ✅", problem: newProblem });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// READ — get all problems (optionally filter by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// CONNECT — request to connect with a problem poster
router.post("/:id/connect", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (!problem.connectRequests.includes(userEmail)) {
      problem.connectRequests.push(userEmail);
      await problem.save();
    }

    res.status(200).json({ message: "Connect request sent ✅" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});
// GET MY POSTS — user ke apne posts with connect requests
router.get("/my-posts/:email", async (req, res) => {
  try {
    const problems = await Problem.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// ACCEPT a connect request — creates a group
router.post("/:id/accept", async (req, res) => {
  try {
    const { connectorEmail } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (!problem.acceptedConnections) problem.acceptedConnections = [];
    if (!problem.acceptedConnections.includes(connectorEmail)) {
      problem.acceptedConnections.push(connectorEmail);
      await problem.save();
    }

    res.status(200).json({ message: "Connection accepted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});
module.exports = router;
