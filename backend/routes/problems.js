const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const Group = require("../models/Group");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please login." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
}

// CREATE — new problem post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { category, title, description } = req.body;
    const userEmail = req.userEmail;

    if (!category || !title || !description) {
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
router.post("/:id/connect", verifyToken, async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (problem.userEmail === userEmail) {
      return res.status(400).json({ message: "You cannot connect to your own post." });
    }

    if (problem.connectRequests.includes(userEmail)) {
      return res.status(400).json({ message: "You already requested to connect." });
    }

    problem.connectRequests.push(userEmail);
    await problem.save();
    res.status(200).json({ message: "Connect request sent ✅" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET MY POSTS — user ke apne posts with connect requests
router.get("/my-posts/:email", verifyToken, async (req, res) => {
  try {
    const problems = await Problem.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// ACCEPT a connect request — creates/updates group
router.post("/:id/accept", verifyToken, async (req, res) => {
  try {
    const { connectorEmail } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (!problem.acceptedConnections) problem.acceptedConnections = [];
    if (!problem.acceptedConnections.includes(connectorEmail)) {
      problem.acceptedConnections.push(connectorEmail);
      await problem.save();
    }

    // Search group for this problem
    let group = await Group.findOne({ problemId: problem._id.toString() });

    if (!group) {
      group = new Group({
        problemId: problem._id.toString(),
        category: problem.category,
        title: problem.title,
        members: [problem.userEmail, connectorEmail]
      });
    } else {
      if (!group.members.includes(connectorEmail)) {
        group.members.push(connectorEmail);
      }
      if (!group.members.includes(problem.userEmail)) {
        group.members.push(problem.userEmail);
      }
    }

    await group.save();

    res.status(200).json({ message: "Connection accepted ✅", groupId: group._id });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});
