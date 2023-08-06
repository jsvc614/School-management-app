const Class = require("../models/Class");
const User = require("../models/User");
const mongoose = require("mongoose");
const Test = require("../models/Test");

const addNewClass = async (req, res) => {
  const {
    className,
    description,
    capacity,
    startingDate,
    day,
    hour,
    teacherEmail,
  } = req.body;

  const existingClass = await Class.findOne({ className }).lean().exec();

  if (existingClass) {
    return res.status(400).json({ message: "Class already exists" });
  }

  const existingTeacher = await User.findOne({
    email: teacherEmail,
  }).exec();

  if (!existingTeacher) {
    return res.status(400).json({ message: "Teacher does not exist" });
  }

  const newClass = await Class.create({
    className,
    description,
    capacity,
    startingDate,
    lectureTime: { day, hour },
    teacher: existingTeacher,
  });

  if (!newClass) {
    return res
      .status(400)
      .json({ message: "Something went wrong with creating new class" });
  } else {
    return res
      .status(200)
      .json({ message: "New class was created successfuly" });
  }
};

const getAllClasses = async (req, res) => {
  const { id, role } = req.user;

  let classes;

  if (role === "TEACHER") {
    classes = await Class.find({
      teacher: id,
    })
      .select("className lectureTime students startingDate")
      .exec();
  } else if (role === "STUDENT") {
    classes = await Class.find({
      "students._id": id,
    })
      .select("className lectureTime students startingDate")
      .exec();
  }
  if (classes) {
    return res.json(classes);
  }
};

const getClassById = async (req, res) => {
  const classId = req.params.classId;

  if (!classId) {
    return res.status(400).json({ message: "ClassId is required" });
  }

  const foundClass = await Class.findById(classId).lean().exec();

  if (!foundClass) {
    return res.status(400).json({ message: "Class does not exist" });
  }

  return res.json(foundClass);
};

const getStudents = async (req, res) => {
  const classId = req.query.classId;

  if (!classId) {
    return res.status(400).json({ message: "ClassId is required" });
  }

  const classStudents = await Class.findById(classId).select("students").exec();

  // const studentIds = classStudents.students.map((s) => s._id);

  if (!classStudents) {
    return res
      .status(400)
      .json({ message: "There are not any students in given class" });
  }

  // const students = await User.find({
  //   _id: {
  //     $in: studentIds,
  //   },
  // })
  //   .select("fullName email")
  //   .exec();

  return res.json(classStudents);
};

const addStudentToClass = async (req, res) => {
  const { studentId, classId } = req.body;

  const foundStudent = await User.findById(studentId).exec();

  if (!foundStudent) {
    return res.status(400).json({ message: "Student does not exist." });
  }

  const foundClass = await Class.findById(classId).exec();

  if (!foundClass) {
    return res.status(400).json({ message: "Class does not exist" });
  }

  let isStudentInClass = false;
  foundClass.students.forEach((student) => {
    if (student._id && student._id.toString() === studentId) {
      isStudentInClass = true;
    }
  });

  if (isStudentInClass) {
    return res.status(400).json({ message: "Student is already in class!" });
  }

  const updatedClass = await foundClass
    .updateOne(
      {
        $push: {
          students: {
            _id: foundStudent,
            fullName: foundStudent.fullName,
            email: foundStudent.email,
          },
        },
      },
      { new: true }
    )
    .exec();

  if (!updatedClass) {
    return res
      .status(400)
      .json({ message: "Problem with updating class students" });
  }

  return res.json({
    message: `Student ${foundStudent.fullName} was added to class ${foundClass.className} `,
    studentId: foundStudent._id,
  });
};

const fillClassAttendance = async (req, res) => {
  const { students, classId, date } = req.body;

  console.log(date, "/////date");

  const studentIds = students.map((s) => s._id);

  console.log(students, "/////////////////students");
  console.log(studentIds, "///////////////studentIDS");

  const foundClass = await Class.findOneAndUpdate(
    {
      _id: classId,
      // "students._id": {
      //   $in: studentIds,
      // },
      // "students.attendance.date":date
    },
    {
      $set: {
        students: students,
      },
    },
    { new: true }
  );

  if (!foundClass) {
    return res
      .status(400)
      .json({ message: "Problem with updating class attendance" });
  }
  return res.json({ message: "Class attendance was updated" });
};

module.exports = {
  addNewClass,
  getAllClasses,
  getClassById,
  addStudentToClass,
  getStudents,
  fillClassAttendance,
};
