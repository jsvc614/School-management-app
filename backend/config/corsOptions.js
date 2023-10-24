let allowedOrigins = ["http://localhost:3000"];
if (process.env.NODE_ENV === "production") {
  allowedOrigins = ["https://school-management-app-one.vercel.app"];
}

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
