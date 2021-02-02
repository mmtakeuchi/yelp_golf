const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Course = require("./models/golf_course");

mongoose.connect("mongodb://localhost:27017/yelp-golf", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/golfcourses", async (req, res) => {
  const courses = await Course.find({});
  res.render("golf_courses/index", { courses });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
