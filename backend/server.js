require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const { logger, logEvents } = require("./middleware/logger");
// const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(express.json({ limit: "25mb" }));

app.use(express.urlencoded({ limit: "25mb" }));

app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes"));
app.use("/class", require("./routes/classRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/user", require("./routes/userRoutes"));
// app.use("/group", require("./routes/groupRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/test", require("./routes/testRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
