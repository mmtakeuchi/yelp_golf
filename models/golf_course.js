const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: String,
  image: String,
  description: String,
  location: String,
  price: Number,
});

module.exports = mongoose.model("Course", CourseSchema);
