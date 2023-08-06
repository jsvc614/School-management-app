const mongoose = require("mongoose");
const { ROLES } = require("../constants/index");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    registered_by: {
      type: ObjectId,
      required: true,
      ref: "Admin",
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    role: { type: String, enum: ["STUDENT", "TEACHER"], required: true },
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
