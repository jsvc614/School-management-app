const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

// router.route("/").get(notificationController.getNotifications);
router.route("/uploadasignment").post(testController.uploadAsignment);
router.route("/asignmentresults").get(testController.getAsignmentResults);
router
  .route("/submittedfiles/:asignmentId")
  .get(testController.asignmentSubmittedFiles);
router.route("/markasignment").post(testController.markAsignment);
router.route("/editasignment").patch(testController.editAsignemnt);
router.route("/removeasignment").delete(testController.removeAsignment);
router.route("/getasignments").get(testController.getClassAsignments);
router.route("/addnewasignment").post(testController.addNewAsignment);

module.exports = router;
