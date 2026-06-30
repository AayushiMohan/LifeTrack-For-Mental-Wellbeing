const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
  groupId: String,
  userEmail: String,
  date: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Checkin", checkinSchema);
