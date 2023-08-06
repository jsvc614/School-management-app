const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const chatGroupSchema = new mongoose.Schema(
  { name: { type: String }, users: [{ type: ObjectId }] },
  { timestamps: true }
);

module.exports = mongoose.model("ChatGroup", chatGroupSchema);
