const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

router.route("/").get(userController.getUser);
router.route("/profile/:email").get(userController.getUserProfile);
router.route("/schedule").get(userController.getUserSchedule);
router.route("/searchstudent/:searchValue").get(userController.searchStudents);
router.route("/students").get(userController.getStudents);
router.route("/teachers").get(userController.getTeachers);
router.route("/getStudentsResults").get(userController.getStudentsResults);
router.route("/getStudentGrades").get(userController.getStudentGrades);
router.route("/getStudentAttendance").get(userController.getStudentAttendance);
router.route("/editprofile").patch(userController.editprofile);
router.route("/contactus").post(userController.contactus);

module.exports = router;
