const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const upload = require("./config/multer");
const connectDB = require("./config/db");
const { writeLogAPI } = require("./middleware/writeLogAPI");

const app = express();

// Kết nối DB
connectDB();

// Middleware cơ bản
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(writeLogAPI);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/app", express.static(path.join(__dirname, "public", "www")));

// View engine
app.set("view engine", "pug");
app.set("views", "./views");

// Routes chính
app.use(require("./routes"));

// View web app
app.get("/app/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "www", "index.html"));
});

// Error handlers
const { catchError } = require("./helpers/catchError");
const { handleError } = require("./helpers/handleError");
app.use(catchError, handleError);

module.exports = app;
