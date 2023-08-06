const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const match = bcrypt.compare(password, foundUser.password);

  if (!match)
    return res.status(400).json({ message: "Wrong username or password" });

  const accessToken = jwt.sign(
    {
      email: foundUser.email,
      id: foundUser._id,
      role: foundUser.role,
      fullName: foundUser.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20m",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
      id: foundUser._id,
      role: foundUser.role,
      fullName: foundUser.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None", //cross-site cookie
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
    user: {
      id: foundUser._id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      fullName: foundUser.fullName,
      role: foundUser.role,
      refreshToken,
      address: foundUser.address,
      image: foundUser.image,
    },
  });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({
        email: decoded.email,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          email: foundUser.email,
          id: foundUser._id,
          role: decoded.role,
          fullName: foundUser.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20m",
        }
      );

      return res.json({
        accessToken,
        user: {
          id: foundUser._id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          fullName: foundUser.fullName,
          role: decoded.role,
          address: foundUser.address,
          image: foundUser.image,
        },
      });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = { login, refresh, logout };
