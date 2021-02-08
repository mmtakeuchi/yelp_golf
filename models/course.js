const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: String,
  images: [{ url: String, filename: String }],
  description: String,
  location: String,
  price: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CourseSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Course", CourseSchema);
