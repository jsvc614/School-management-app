const User = require("../models/User");
// const escapeStringRegexp = require("escape-string-regexp");
const Mongoose = require("mongoose");
const Test = require("../models/Test");
const Class = require("../models/Class");
const cloudinary = require("../utils/cloudinary");
const Email = require("../utils/nodemailer");

const { ObjectId } = Mongoose.Types;

const getUser = async (req, res) => {
  const searchValue = req.query.searchvalue;

  const users = await User.find({
    fullName: { $regex: searchValue, $options: "i" },
  })
    .limit(10)
    .select("fullName _id")
    .exec();

  return res.json(users);
};

const getUserProfile = async (req, res) => {
  const { email } = req.params;

  const foundUser = await User.findOne({ email }).select("-password").exec();

  if (!foundUser) {
    return res.status(400).json({ message: "User information was not found" });
  } else {
    return res.status(201).json(foundUser);
  }
};

const getUserSchedule = async (req, res) => {
  const { id, role } = req.user;

  let classesSchedule;
  if (role === "TEACHER") {
    classesSchedule = await Class.find({
      teacher: id,
    })
      .select("className lectureTime startingDate")
      .exec();
  } else if (role === "STUDENT") {
    classesSchedule = await Class.find({
      "students._id": id,
    })
      .select("className lectureTime  startingDate")
      .exec();
  }

  const testsSchedule = await Test.find({
    class: { $in: classesSchedule },
    submissionDate: { $gt: new Date() },
  })
    .select("active name description createdAt submissionDate testType class")
    .exec();

  return res.json({ classesSchedule, testsSchedule });
};

const getStudents = async (req, res) => {
  const students = await User.find({ role: "STUDENT" });

  return res.json(students);
};

const getTeachers = async (req, res) => {
  const teachers = await User.find({ role: "TEACHER" });

  return res.json(teachers);
};

const searchStudents = async (req, res) => {
  const searchValue = req.params.searchValue;

  const foundStudents = await User.find({
    fullName: { $regex: searchValue, $options: "i" },
    role: "STUDENT",
  })
    .limit(10)
    .select("fullName _id")
    .exec();

  return res.json(foundStudents);
};

const editprofile = async (req, res) => {
  const { email, address, image } = req.body;

  const { id } = req.user;

  let updateData = { email, address };

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);

      updateData = {
        email,
        address,
        image: {
          public_id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        },
      };
    }
  } catch (error) {
    return res.status(400).json({ message: "Problem with uploading file" });
  }

  const updatedUser = await User.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  if (updatedUser) {
    return res.json({ message: "User profile was updated" });
  }
};

const getStudentsResults = async (req, res) => {
  const { id, role, fullName } = req.user;

  if (role !== "TEACHER") {
    return res.status(400).json({ message: "Unauthorized" });
  }

  // const foundClasses = await Class.find({ teacher: fullName })
  //   .select("submittedStudents name")
  //   .exec();

  const teacherId = new ObjectId(id);

  const foundTests = await Test.aggregate([
    { $match: { teacher: fullName } },
    {
      $lookup: {
        from: "classes",
        // let: { class_id: getStudentsResults },
        as: "class",
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$teacher", teacherId] }] } } },
          { $project: { className: 1 } },
        ],
      },
    },
    {
      $project: {
        class: { $arrayElemAt: ["$class", 0] },
        submittedStudents: 1,
      },
    },
  ]);

  if (!foundTests) {
    return res.status(400).json({ message: "Problem with find classes" });
  }

  const restructuredClasses = foundTests.map((foundTest) => {
    const marks = [];
    foundTest.submittedStudents.forEach((student) => {
      marks.push(Number(student.mark));
    });

    return {
      className: foundTest?.class?.className,
      studentsMarks:
        marks.length > 0 && marks.reduce((a, b) => a + b) / marks.length,
    };
  });

  return res.json(restructuredClasses);
};

const getStudentAttendance = async (req, res) => {
  const { id } = req.user;

  const userId = new ObjectId(id);

  const studentGrades = await Class.aggregate([
    {
      $match: {
        "students._id": userId,
      },
    },
    {
      $project: {
        className: 1,
        students: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$students",
                as: "student",
                cond: { $eq: ["$$student._id", userId] },
              },
            },
            0,
          ],
        },
      },
    },
  ]);

  return res.json(studentGrades);
};

const getStudentGrades = async (req, res) => {
  const { id } = req.user;

  const userId = new ObjectId(id);

  const studentGrades = await Test.aggregate([
    { $match: { "submittedStudents._id": userId } },
    { $sort: { class: 1 } },
    {
      $project: {
        class: 1,
        name: 1,
        teacher: 1,
        submittedStudents: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$submittedStudents",
                as: "submittedStudent",
                cond: [
                  {
                    $and: [
                      { $eq: ["$$submittedStudent._id", userId] },
                      {
                        $ne: [{ $type: "$$submittedStudent.grade" }, "missing"],
                      },
                    ],
                  },
                ],
              },
            },
            0,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "classes",
        let: { classId: "$class" },
        as: "foundClass",
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$_id", "$$classId"] }] },
            },
          },
          { $project: { className: 1 } },
        ],
      },
    },
    { $unwind: "$foundClass" },
    { $unwind: "$submittedStudents" },
    {
      $group: {
        _id: "$foundClass._id",
        marks: {
          $push: {
            class: "$foundClass.className",
            teacher: "$teacher",
            name: "$name",
            mark: "$submittedStudents.mark",
            points: "$submittedStudents.points",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.json(studentGrades);
};

const contactus = async (req, res) => {
  const { name, email, message } = req.body;
  const options = {
    from: `Schoolapp  <${email}>`,
    to: process.env.EMAIL,
    subject: "Message From school app",
    html: `
        <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; background-color: #00efbc; padding: 20px 0">         
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
              From school app
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
              <p>FullName: <b>${name}</b></p>
              <p>Email: <b>${email}</b></p>
              <p>Message: <i>${message}</i></p>
            </div>
          </div>
        </div>
      </div>
        `,
  };

  Email(options, res);
};

module.exports = {
  getUser,
  getUserSchedule,
  getStudents,
  getTeachers,
  searchStudents,
  editprofile,
  getUserProfile,
  getStudentsResults,
  getStudentAttendance,
  getStudentGrades,
  contactus,
};
