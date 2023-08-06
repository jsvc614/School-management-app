const Mongoose = require("mongoose");
const Test = require("../models/Test");
const Class = require("../models/Class");

// const { ObjectId } = Mongoose.Types;
const uploadAsignment = async (req, res) => {
  const { fileBase64, fileName, asignmentId, submittedAt, _id } = req.body;

  const { fullName } = req.user;

  if (!fileBase64 || !fileName || !asignmentId) {
    return res.status(400).json({ message: "Asignemnt info data missing" });
  }

  const studentUploadedFile = await Test.findOne({
    _id: asignmentId,
    "submittedStudents.studentName": fullName,
  })
    .lean()
    .exec();

  let updatedTest;

  if (!studentUploadedFile) {
    console.log("push");
    updatedTest = await Test.findByIdAndUpdate(asignmentId, {
      $push: {
        submittedStudents: {
          _id,
          studentName: fullName,
          fileBase64,
          fileName,
          submittedAt,
        },
      },
    });
  } else {
    console.log("set");
    updatedTest = await Test.findOneAndUpdate(
      { _id: asignmentId, "submittedStudents.studentName": fullName },
      {
        $set: {
          "submittedStudents.$.studentName": fullName,
          "submittedStudents.$.fileName": fileName,
          "submittedStudents.$.fileBase64": fileBase64,
          "submittedStudents.$.submittedAt": submittedAt,
        },
      }
    );
  }

  if (!updatedTest) {
    return res.status(400).json({ message: "Problem with updating student" });
  }

  return res.json({ message: `File ${fileName} was submitted` });
};

const asignmentSubmittedFiles = async (req, res) => {
  const asignmentId = req.params.asignmentId;

  if (!asignmentId) {
    return res.status(400).json({ message: "Asignment ID is missing" });
  }

  const asignmentSubmittedFiles = await Test.findById(asignmentId)
    .lean()
    .exec();

  if (!asignmentSubmittedFiles) {
    return res.status(400).json({ message: "Test does not exist" });
  }

  return res.json(asignmentSubmittedFiles);
};

const markAsignment = async (req, res) => {
  const {
    points,
    mark,
    teacherFeedback,
    asignmentId,
    studentName,
    evaluatedAt,
  } = req.body;

  const foundTest = await Test.findOneAndUpdate(
    { _id: asignmentId, "submittedStudents.studentName": studentName },
    {
      $set: {
        "submittedStudents.$.points": points,
        "submittedStudents.$.mark": mark,
        "submittedStudents.$.teacherFeedback": teacherFeedback,
        "submittedStudents.$.evaluatedAt": evaluatedAt,
      },
    }
  );

  if (!foundTest) {
    return res
      .status(400)
      .json({ message: "Problem with marking student asignment" });
  }

  return res.json({
    message: `Student ${studentName} asignment ${foundTest.name} was successfully evaluated `,
    asignment: foundTest,
  });
};

const getAsignmentResults = async (req, res) => {
  const asignmentId = req.query.asignmentId;
  const { id } = req.user;

  const foundResults = await Test.findOne({
    _id: asignmentId,
    "submittedStudents._id": id,
  }).exec();

  const studentResults = foundResults.submittedStudents.filter(
    (student) => student._id.toString() === id
  );

  foundResults.submittedStudents = studentResults;

  if (!foundResults) {
    return res.status(400).json({ message: "There are no results" });
  }
  return res.json(foundResults);
};

const addNewAsignment = async (req, res) => {
  const {
    name,
    description,
    availablePoints,
    submissionDate,
    testType,
    classId,
  } = req.body;

  const { fullName } = req.user;

  if (
    !name ||
    !description ||
    !availablePoints ||
    !submissionDate ||
    !testType ||
    !classId
  ) {
    return res.status(400).json({ message: "Asignment form incomplete" });
  }

  const foundAsignment = await Test.findOne({ name }).lean().exec();

  if (foundAsignment) {
    return res.status(400).json({ message: "Asignment already exists" });
  }

  const foundClass = await Class.findById(classId).exec();

  if (!foundClass) {
    return res.status(400).json({ message: "Class does not exist" });
  }

  const newAsignment = await Test.create({
    name,
    description,
    availablePoints,
    submissionDate,
    testType,
    class: foundClass,
    teacher: fullName,
  });

  if (!newAsignment) {
    return res.status(400).json({
      message: `Problem with creating asignment!`,
    });
  }

  return res.status(201).json({ message: `${testType} ${name} was created` });
};

const editAsignemnt = async (req, res) => {
  const { asignmentId, availablePoints, description, name, submissionDate } =
    req.body;
  if (
    !asignmentId ||
    !availablePoints ||
    !description ||
    !name ||
    !submissionDate
  ) {
    return res.status(400).json({ message: "Asignment info data missing" });
  }

  const test = await Test.findByIdAndUpdate(
    asignmentId,
    {
      $set: {
        name,
        availablePoints,
        description,
        submissionDate,
      },
    },
    { new: true }
  ).exec();

  if (!test) {
    return res.status(400).json({ message: "Test does not exist" });
  }

  return res.json({ message: `Asignment ${test.name} was updated` });
};

const removeAsignment = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Asignment id missing" });
  }

  console.log(req.body);

  const test = await Test.findByIdAndDelete(id).exec();

  if (!test) {
    return res.status(400).json({ message: "Problem with removing test" });
  }

  return res.json({ message: `Asignment ${test.name} was removed` });
};

const getClassAsignments = async (req, res) => {
  const classId = req.query.classId;

  const { fullName } = req.user;

  if (!classId) {
    return res.status(400).json({ message: "Class id query missing" });
  }

  const foundClass = await Class.findById(classId);

  const classAsignments = await Test.find({
    class: {
      $in: classId,
    },
  })
    .lean()
    .exec();

  if (!classAsignments) {
    return res.status(400).json({ message: "Class or asignments missing" });
  }

  const a = classAsignments.map((asignment) => {
    const submittedStudent = asignment.submittedStudents.filter(
      (subStudent) => subStudent.studentName === fullName
    );
    return {
      _id: asignment._id,
      name: asignment.name,
      description: asignment.description,
      availablePoints: asignment.availablePoints,
      submissionDate: asignment.submissionDate,
      active: asignment.active,
      submittedStudent: submittedStudent[0],
      testType: asignment.testType,
    };
  });

  return res.json({ asignments: a, class: foundClass });
};

module.exports = {
  uploadAsignment,
  removeAsignment,
  editAsignemnt,
  getAsignmentResults,
  markAsignment,
  asignmentSubmittedFiles,
  getClassAsignments,
  addNewAsignment,
};
