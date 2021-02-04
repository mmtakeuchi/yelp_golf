const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { courseSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const Course = require("../models/course");

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render("courses/index", { courses });
  })
);

router.get("/new", (req, res) => {
  res.render("courses/new");
});

router.post(
  "/",
  validateCourse,
  catchAsync(async (req, res, next) => {
    const course = new Course(req.body.course);
    await course.save();
    res.redirect(`/courses/${course._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id).populate("reviews");
    if (!course) {
      return res.redirect("/courses");
    }
    res.render("courses/show", { course });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.redirect("/courses");
    }
    res.render("courses/edit", { course });
  })
);

router.put(
  "/:id",
  validateCourse,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, {
      ...req.body.course,
    });
    res.redirect(`/courses/${course._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.redirect("/courses");
  })
);

module.exports = router;
