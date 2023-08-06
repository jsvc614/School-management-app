const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    users: [{ type: ObjectId, required: true }],
    title: { type: String, required: true },
    type: { type: String, required: true },
    ref: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
