const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

router.route("/").get(notificationController.getNotifications);
router.route("/new").post(notificationController.newNotification);
router.route("/read").put(notificationController.userReadNotification);

module.exports = router;
