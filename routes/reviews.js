const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware");
const Course = require("../models/course");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    const review = new Review(req.body.review);
    course.reviews.push(review);
    await review.save();
    await course.save();
    req.flash("success", "Added new golf course!");
    res.redirect(`/courses/${course._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/courses/${id}`);
  })
);

module.exports = router;
