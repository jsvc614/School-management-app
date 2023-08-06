const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.route("/newUser").post(adminController.addUser);
// router.route("/newAdmin").post(adminController.addAdmin);
router.route("/x").post(adminController.x);

module.exports = router;
