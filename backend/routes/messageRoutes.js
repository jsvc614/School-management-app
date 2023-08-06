const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

router.route("/:userId").get(messageController.getSpecificMessages);
router.route("/group/:group").get(messageController.getGroupMessages);
router.route("/").get(messageController.getLatestMessages);
router.route("/newmessage").post(messageController.newMessage);
router.route("/read").patch(messageController.userReadMessage);

module.exports = router;
