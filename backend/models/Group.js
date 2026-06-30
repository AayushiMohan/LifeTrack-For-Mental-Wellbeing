const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  problemId: String,
  category: String,
  title: String,
  members: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Group", groupSchema);
