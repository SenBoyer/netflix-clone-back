const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Movie = require("../models/Movie");
const Feature = require("../models/Featured");
const verify = require("../verifyToken");
const { response } = require("express");
const { db } = require("../models/List");

router.get("/", verify, async (request, response) => {
  let featuredMovies = await Movie.find();
  Feature.response.status(200).json(featuredMovies);
  db.Movie.aggregate([{ $out: "Feature" }]);
});

router.post("/", async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: "The Sopranos" });
    const featureParams = { ...movie.toObject() };
    delete featureParams._id;
    const newFeature = new Feature(featureParams);
    const savedFeature = await newFeature.save();
    res.status(201).json(savedFeature);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verify, async (request, response) => {
  try {
    const deletedMovie = await Feature.deleteOne({ _id: request.params.id });
    response.status(201).send(`Deleted= ${deletedMovie}`);
  } catch (err) {
    console.log(err);
    response.status(404).json(err);
  }
});

//RANDOM

router.get("/random", verify, async (request, response) => {
  const type = request.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Feature.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Feature.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    response.status(200).json(movie);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;
