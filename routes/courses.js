const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCourse } = require("../middleware");

const Course = require("../models/course");

router.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render("courses/index", { courses });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("courses/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCourse,
  catchAsync(async (req, res, next) => {
    const course = new Course(req.body.course);
    course.author = req.user._id;
    await course.save();
    req.flash("success", "Successfully added golf course");
    res.redirect(`/courses/${course._id}`);
  })
);

router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(course);
    if (!course) {
      req.flash("error", "Cannot find that golf course!");
      return res.redirect("/courses");
    }
    res.render("courses/show", { course });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      req.flash("error", "Cannot find that golf course!");
      return res.redirect("/courses");
    }
    res.render("courses/edit", { course });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCourse,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, {
      ...req.body.course,
    });
    req.flash("success", "Successfully updated golf course!");
    res.redirect(`/courses/${course._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted golf course");
    res.redirect("/courses");
  })
);

module.exports = router;
