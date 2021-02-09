const Course = require("../models/course");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const courses = await Course.find({});
  res.render("courses/index", { courses });
};

module.exports.renderNewForm = (req, res) => {
  res.render("courses/new");
};

module.exports.createCourse = async (req, res, next) => {
  const course = new Course(req.body.course);
  course.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  course.author = req.user._id;
  await course.save();
  console.log(course);
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
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  course.images.push(...imgs);
  await course.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await course.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated course!");
  res.redirect(`/courses/${course._id}`);
};

module.exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted course");
  res.redirect("/courses");
};
