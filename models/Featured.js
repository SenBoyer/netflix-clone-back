const mongoose = require("mongoose");

const FeaturedSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String },
  img: { type: String },
  imgTitle: { type: String },
  imgSmall: { type: String },
  trailer: { type: String },
  video: { type: String },
  year: { type: String },
  duration: { type: Number },
  genre: { type: String },
  isSeries: { type: Boolean, default: false },
});

module.exports = mongoose.model("Feature", FeaturedSchema);
