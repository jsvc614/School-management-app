// let allowedOrigins = ["http://localhost:3000"];
// if (process.env.NODE_ENV === "production") {
//   allowedOrigins = ["https://school-management-app-one.vercel.app"];
// }

let allowedOrigins = [
  "https://school-management-app-one.vercel.app",
  "https://school-management-app-jurajsvec614-gmailcom.vercel.app",
  "https://school-management-app-git-main-jurajsvec614-gmailcom.vercel.app",
];

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
