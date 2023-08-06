const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const cloudinary = require("../utils/cloudinary");

// const addAdmin = async (req, res) => {
//   const { firstName, lastName, email, password, address } = req.body;

//   if (!firstName || !lastName || !email || !password || !address) {
//     return res
//       .status(400)
//       .json({ message: "Admin registration data incomplete" });
//   }

//   const foundAdmin = await Admin.findOne({ email }).exec();

//   if (foundAdmin) {
//     return res
//       .status(400)
//       .json({ message: "Admin with given email already exists" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newAdmin = await Admin.create({
//     firstName,
//     lastName,
//     fullName: firstName + " " + lastName,
//     email,
//     password: hashedPassword,
//     address,
//   });

//   if (newAdmin) {
//     return res.status(201).json({ message: "Admin was registered" });
//   } else {
//     return res.status(400).json({ message: "Something went wrong" });
//   }
// };

const addUser = async (req, res) => {
  const {
    registered_by,
    fullName,
    email,
    password,
    address,
    education,
    role,
    image,
  } = req.body;

  if (!registered_by || !email || !password || !address || !role || !image) {
    return res
      .status(400)
      .json({ message: "Teacher registration data incomplete" });
  }

  const admin = await Admin.findById(registered_by).exec();

  if (!admin) {
    return res.status(400).json({ message: "Admin does not exist" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (foundUser) {
    return res.json({ message: "User already exists" });
  }

  try {
    const uploadedResponse = await cloudinary.uploader.upload(image);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      registered_by: admin,
      fullName,
      email,
      password: hashedPassword,
      address,
      education,
      role,
      image: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
    });

    if (user) {
      return res.status(201).json({ message: "User was registered" });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Problem with cloudinary" });
  }
};

const x = async (req, res) => {
  const { image } = req.body;
  const users = await User.find().exec();

  users.forEach(async (user) => {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      user.image = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
      await user.save();
    } catch (error) {
      return res.status(400).json({ message: "Problem with cloudinary" });
    }
  });

  return res.status(201).json({ message: "Success" });
};

module.exports = { addUser, x };
