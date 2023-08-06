const Mongoose = require("mongoose");
const Notification = require("../models/Notification");

const { ObjectId } = Mongoose.Types;

const getNotifications = async (req, res) => {
  const { id } = req.user;

  const foundNotifications = await Notification.find({
    users: {
      $in: new ObjectId(id),
    },
  })
    .sort({ createdAt: -1 })
    .exec();

  if (!foundNotifications) {
    return res.json(["pes"]);
  }

  return res.json(foundNotifications);
};

const newNotification = async (req, res) => {
  const { users, title, type, ref } = req.body;

  console.log(users);

  const objectIdUsers = users.map((user) => new ObjectId(user));

  const newNotification = await Notification.create({
    users: objectIdUsers,
    title,
    type,
    ref,
  });

  if (newNotification) {
    return res.json(newNotification);
  }
};

const deleteNotification = async (req, res) => {};

const userReadNotification = async (req, res) => {
  const { notificationId } = req.body;

  console.log(notificationId);

  if (!notificationId) {
    return res.status(400).json({ message: "Notification ID is missing" });
  }

  const updatedNotification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    { read: true }
  );

  if (updatedNotification) {
    return res.json({ message: "Notification was updated" });
  } else {
    return res.json({ message: "Problem with updating notification" });
  }
};

module.exports = {
  getNotifications,
  newNotification,
  deleteNotification,
  userReadNotification,
};
