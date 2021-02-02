const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GolfCourseSchema = new Schema({
  name: String,
  description: String,
  location: String,
  price: String,
});

module.exports = mongoose.model("GolfCourse", GolfCourseSchema);
