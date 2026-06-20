const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  userEmail: String,
  anonymousName: String,
  category: String,
  title: String,
  description: String,
  connectRequests: [String],
  acceptedConnections: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Problem", problemSchema);
