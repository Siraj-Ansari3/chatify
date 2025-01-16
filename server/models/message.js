const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: String,
  author: String,
  message: String,
  time: String,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message", // Referencing the Message model
    default: null, // Optional field, defaults to null if not a reply
  }
});
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
