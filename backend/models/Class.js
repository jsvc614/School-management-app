const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const classStudentSchema = new mongoose.Schema({
  _id: { type: ObjectId, ref: "Student", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  attendance: [
    {
      date: { type: Date, required: true },
      attended: { type: Boolean, required: true },
      createdAt: { type: Date, default: new Date() },
    },
  ],
});

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    startingDate: { type: Date, required: true },
    endDate: { type: Date },
    lectureTime: {
      day: { type: Number, required: true },
      hour: { type: Number, required: true },
    },
    // tests: [{ type: ObjectId, ref: "Test" }],
    students: [classStudentSchema],
    teacher: { type: ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
