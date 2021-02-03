const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/golfcourses",
  catchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render("golf_courses/index", { courses });
  })
);

app.get("/golfcourses/new", (req, res) => {
  res.render("golf_courses/new");
});

app.post(
  "/golfcourses",
  catchAsync(async (req, res, next) => {
    const courseSchema = Joi.object({
      course: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
      }).required(),
    });
    const { error } = courseSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    const course = new Course(req.body.course);
    await course.save();
    res.redirect(`/golfcourses/${course._id}`);
  })
);

app.get(
  "/golfcourses/:id",
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render("golf_courses/show", { course });
  })
);

app.get(
  "/golfcourses/:id/edit",
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render("golf_courses/edit", { course });
  })
);

app.put(
  "/golfcourses/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
    res.redirect(`/golfcourses/${course._id}`);
  })
);

app.delete(
  "/golfcourses/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.redirect("/golfcourses");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
