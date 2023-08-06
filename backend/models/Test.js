const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const studentTestInfoSchema = new mongoose.Schema({
  _id: { type: ObjectId },
  studentName: { type: String, ref: "Student" },
  points: { type: String },
  mark: { type: String },
  fileBase64: { type: String },
  fileName: { type: String },
  teacherFeedback: { type: String },
  submittedAt: { type: Date },
  evaluatedAt: { type: Date },
});

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    availablePoints: { type: Number, required: true },
    submissionDate: { type: Date, required: true },
    testType: { type: String, enum: ["ASIGNMENT", "EXAM"], required: true },
    active: { type: Boolean, default: true },
    class: { type: ObjectId, ref: "Class" },
    submittedStudents: [studentTestInfoSchema],
    teacher: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
