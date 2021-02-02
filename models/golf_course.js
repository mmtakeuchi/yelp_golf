const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: String,
  description: String,
  location: String,
  price: String,
});

module.exports = mongoose.model("Course", CourseSchema);
