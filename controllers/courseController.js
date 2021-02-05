const Course = require("../models/course");

module.exports.index = async (req, res) => {
  const courses = await Course.find({});
  res.render("courses/index", { courses });
};

module.exports.renderNewForm = (req, res) => {
  res.render("courses/new");
};

module.exports.createCourse = async (req, res, next) => {
  const course = new Course(req.body.course);
  course.author = req.user._id;
  await course.save();
  req.flash("success", "Successfully made a new course!");
  res.redirect(`/courses/${course._id}`);
};

module.exports.showCourse = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!course) {
    req.flash("error", "Cannot find that golf course!");
    return res.redirect("/courses");
  }
  res.render("courses/show", { course });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    req.flash("error", "Cannot find that course!");
    return res.redirect("/courses");
  }
  res.render("courses/edit", { course });
};

module.exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, {
    ...req.body.course,
  });
  req.flash("success", "Successfully updated course!");
  res.redirect(`/courses/${course._id}`);
};

module.exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted course");
  res.redirect("/courses");
};
