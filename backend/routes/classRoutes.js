const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

router.route("/addnewclass").post(classController.addNewClass);
router.route("/getallclasses").get(classController.getAllClasses);
router.route("/addstudent").put(classController.addStudentToClass);
router.route("/getstudents").get(classController.getStudents);
router.route("/:classId").get(classController.getClassById);
router.route("/attendance").patch(classController.fillClassAttendance);

module.exports = router;
