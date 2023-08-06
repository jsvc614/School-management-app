const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    fromUser: { type: ObjectId, required: true },
    recipient: { type: ObjectId, required: true },
    message: { type: String, required: true },
    read: { marked: { type: Boolean, default: false }, date: { type: Date } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
