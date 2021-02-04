const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/course");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    const review = new Review(req.body.review);
    course.reviews.push(review);
    await review.save();
    await course.save();
    res.redirect(`/golfcourses/${course._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/golfcourses/${id}`);
  })
);

module.exports = router;
