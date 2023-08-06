const Mongoose = require("mongoose");
const ChatGroup = require("../models/ChatGroup");
const User = require("../models/User");
const Message = require("../models/Message");
const { default: mongoose } = require("mongoose");

const { ObjectId } = Mongoose.Types;

const getSpecificMessages = async (req, res) => {
  let { userId } = req.params;
  const { id } = req.user;

  const chatter = await User.findById(userId).exec();

  if (!chatter) {
    const foundGroup = await ChatGroup.findOne({ name: userId }).exec();
    console.log(foundGroup);
    if (foundGroup) {
      const messages = await Message.find({
        recipient: { $in: [foundGroup._id] },
      })
        .sort({ createdAt: 1 })
        .exec();

      return res.json({ messages, chatter: foundGroup, group: true });
    }
  }
  const messages = await Message.find({
    fromUser: { $in: [id, userId] },
    recipient: { $in: [id, userId] },
  })
    .sort({ createdAt: 1 })
    .exec();

  return res.json({ messages, chatter, group: false });
};

const getGroupMessages = async (req, res) => {
  let { group } = req.params;

  const foundGroup = await ChatGroup.findOne({ name: group }).exec();
  console.log(foundGroup);
  if (foundGroup) {
    const messages = await Message.find({
      recipient: { $in: [foundGroup._id] },
    })
      .sort({ createdAt: 1 })
      .exec();

    return res.json({ messages, chatter: foundGroup });
  }
  return res.json({ messages: [], chatter: null });
};

const getLatestMessages = async (req, res) => {
  const { id } = req.user;

  const userId = new ObjectId(id);

  console.log(id);

  const chatGroupIds = await ChatGroup.find({ users: { $in: userId } })
    .select("_id")
    .exec();

  const groupIds = chatGroupIds.map((group) => group._id);

  const groupMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ recipient: { $in: groupIds } }],
      },
    },
    {
      $group: {
        _id: { group: "$recipient" },
        document: { $last: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$document" } },
    {
      $lookup: {
        from: "users",
        let: { fromUser: "$fromUser" },
        as: "fromUserInfo",
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$_id", "$$fromUser"] }] } } },
        ],
      },
    },
    { $unwind: "$fromUserInfo" },
    {
      $lookup: {
        from: "chatgroups",
        let: { recipient: "$recipient" },
        as: "recipientGroupInfo",
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$_id", "$$recipient"] }] } } },
        ],
      },
    },
    {
      $unwind: "$recipientGroupInfo",
    },
    { $sort: { createdAt: -1 } },
  ]);

  const userMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ fromUser: userId }, { recipient: userId }],
      },
    },
    {
      $addFields: {
        me: {
          $cond: [{ $ne: ["$fromUser", userId] }, "$recipient", "$fromUser"],
        },
        other: {
          $cond: [{ $ne: ["$fromUser", userId] }, "$fromUser", "$recipient"],
        },
      },
    },
    {
      $group: {
        _id: { me: "$me", other: "$other" },
        document: { $last: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$document" } },
    {
      $lookup: {
        from: "users",
        let: { fromUser: "$fromUser" },
        as: "fromUserInfo",
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$_id", "$$fromUser"] }] } } },
        ],
      },
    },
    { $unwind: "$fromUserInfo" },
    {
      $lookup: {
        from: "users",
        let: { recipient: "$recipient" },
        as: "recipientInfo",
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$_id", "$$recipient"] }] } } },
        ],
      },
    },
    { $unwind: "$recipientInfo" },
    { $sort: { createdAt: -1 } },
  ]);

  const finalMessages = [...groupMessages, ...userMessages].sort(
    (date1, date2) =>
      new Date(date2.createdAt).getTime() - new Date(date1.createdAt).getTime()
  );

  return res.json(finalMessages);
};

const newMessage = async (req, res) => {
  const {
    fromUser,
    message,
    recipient,
    recipientGroup,
    recipientName,
    senderName,
  } = req.body;

  console.log(recipientName);

  if (!recipientGroup && !recipient) {
    return res.status(400).json({ message: "Missing data" });
  }

  if (!fromUser || !message) {
    return res.status(400).json({ message: "Missing data" });
  }

  const fromUserInfo = await User.findById(fromUser).exec();

  if (recipientGroup) {
    console.log(recipientGroup);

    let foundGroup = await ChatGroup.findOne({
      users: { $all: recipientGroup },
    }).exec();

    if (!foundGroup) {
      const recipientGroupObjectId = recipientGroup.map((g) => new ObjectId(g));
      foundGroup = await ChatGroup.create({
        name: recipientName,
        users: recipientGroupObjectId,
      });
    }
    console.log(foundGroup);
    const newMessage = await Message.create({
      fromUser,
      recipient: foundGroup._id,
      message,
    });

    if (newMessage) {
      return res.status(200).json({
        fromUser,
        recipient: newMessage._id,
        recipientName,
        senderName,
        message,
        createdAt: newMessage.createdAt,
        recipientGroupInfo: foundGroup,
        fromUserInfo,
      });
    }
  }

  const newMessage = await Message.create({
    fromUser,
    recipient,
    message,
  });

  if (newMessage) {
    return res.status(200).json({
      fromUser,
      message,
      recipient,
      recipientName,
      senderName,
      createdAt: newMessage.createdAt,
    });
  }
};

const userReadMessage = async (req, res) => {
  const { messageId, fromUser, recipient } = req.body;

  const date = new Date();

  let updatedMessage;

  if (messageId) {
    updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      {
        read: { marked: true, date },
      },
      {
        upsert: true,
        sort: { createdAt: -1 },
      }
    ).exec();
  } else {
    updatedMessage = await Message.findOneAndUpdate(
      { fromUser: fromUser, recipient: recipient },
      {
        read: { marked: true, date },
      },
      {
        upsert: true,
        sort: { createdAt: -1 },
      }
    ).exec();
  }

  if (!updatedMessage) {
    return res
      .status(400)
      .json({ message: "Problem with updating message read" });
  } else {
    return res.json({
      _id: updatedMessage._id,
      fromUser: updatedMessage.fromUser,
      recipient: updatedMessage.recipient,
      message: updatedMessage.message,
      createdAt: updatedMessage.createdAt,
      read: { marked: true, date },
    });
  }
};

module.exports = {
  getSpecificMessages,
  getLatestMessages,
  newMessage,
  getGroupMessages,
  userReadMessage,
};
