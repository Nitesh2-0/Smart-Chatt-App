const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  message: {
    text: {
      type: String,
      required: true
    }
  },
  users: {
    type: Array,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Messages", msgSchema);
