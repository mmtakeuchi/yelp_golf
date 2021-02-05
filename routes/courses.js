const express = require("express");
const router = express.Router();
const courses = require("../controllers/coursesController");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCourse } = require("../middleware");

const Course = require("../models/course");

router
  .route("/")
  .get(catchAsync(courses.index))
  .post(isLoggedIn, validateCourse, catchAsync(courses.createCourse));

router.get("/new", isLoggedIn, courses.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(courses.showCourse))
  .put(isLoggedIn, isAuthor, validateCourse, catchAsync(courses.updateCourse))
  .delete(isLoggedIn, isAuthor, catchAsync(courses.deleteCourse));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(courses.renderEditForm)
);

module.exports = router;
