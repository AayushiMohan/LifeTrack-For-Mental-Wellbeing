const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Message = require("../models/Message");
const Checkin = require("../models/Checkin");
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

// GET all groups jisme yeh user member hai
router.get("/my-groups", verifyToken, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userEmail }).sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET single group details 
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    if (!group.members.includes(req.userEmail)) {
      return res.status(403).json({ message: "You are not a member of this group." });
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET all messages of a group 
router.get("/:id/messages", verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    if (!group.members.includes(req.userEmail)) {
      return res.status(403).json({ message: "You are not a member of this group." });
    }

    const messages = await Message.find({ groupId: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// POST a new messages
router.post("/:id/messages", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    if (!group.members.includes(req.userEmail)) {
      return res.status(403).json({ message: "You are not a member of this group." });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    const message = new Message({
      groupId: req.params.id,
      senderEmail: req.userEmail,
      text: text.trim()
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// POST daily checkin 
router.post("/:id/checkin", verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    if (!group.members.includes(req.userEmail)) {
      return res.status(403).json({ message: "You are not a member of this group." });
    }

    const today = new Date().toISOString().split("T")[0]; // "2026-06-30"

    const alreadyCheckedIn = await Checkin.findOne({
      groupId: req.params.id,
      userEmail: req.userEmail,
      date: today
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "Already checked in today ✅" });
    }

    const checkin = new Checkin({
      groupId: req.params.id,
      userEmail: req.userEmail,
      date: today
    });

    await checkin.save();
    res.status(201).json({ message: "Checked in successfully 🔥" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET streak data for all members of a group
router.get("/:id/streaks", verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    if (!group.members.includes(req.userEmail)) {
      return res.status(403).json({ message: "You are not a member of this group." });
    }

    const checkins = await Checkin.find({ groupId: req.params.id });

    const streakData = {};
    group.members.forEach(member => {
      const memberCheckins = checkins.filter(c => c.userEmail === member);
      streakData[member] = memberCheckins.length;
    });

    res.status(200).json(streakData);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
