const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//CREATE

// router.post("/", verify, async (request, response) => {
//   if (request.user.isAdmin) {
//     try {
//       const newMovie = new Movie(request.body);
//       savedMovie = await newMovie.save();
//       response.status(200).json(`saved ${savedMovie}`);
//     } catch (error) {
//       response.status(500).json("error in catch:", error);
//     }
//   } else response.status(404).json("not authorized");
// });

//CREATE2

router.post("/", verify, async (request, response) => {
  if (request.user.isAdmin) {
    const newMovie = new Movie(request.body);
    try {
      const savedMovie = await newMovie.save();
      response.status(201).json(savedMovie);
    } catch (err) {
      response.status(500).json(err);
    }
  } else {
    response.status(403).json("You are not allowed!");
  }
});

//UPDATE

router.put("/:id", verify, async (request, response) => {
  if (request.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        request.params.id,
        {
          $set: request.body,
        },
        { new: true }
      );
      response.status(200).json(updatedMovie);
    } catch (error) {
      response.status(500).json("error in catch:", error);
    }
  } else response.json("not authorized");
});

//DELETE

router.delete("/:id", verify, async (request, response) => {
  if (request.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(request.params.id);
      response.json("movie has been deleted!");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("error in if/else");
  }
});

//GET

router.get("/find/:id", async (request, response) => {
  try {
    const hiddenMovie = Movie.findById(
      request.params.id,
      (error, hiddenMovie) => {
        if (!error) {
          response.status(201).json(hiddenMovie);
        } else {
          response.status(404).json("error in if/else");
        }
      }
    );
  } catch (err) {
    response.json(err);
  }
});

//GET ALL

router.get("/", async (request, response) => {
  const movies = await Movie.find();
  response.json(movies);
});

//GET RANDOM MOVIE

// router.get("/random", verify, async (request, response) => {
//   const randomMovie = await Movie.find();
//   number = Math.floor(Math.random() * randomMovie.length);
//   response.status(201).json(randomMovie[number]);
// });

//GET RANDOM MOVIE 2

router.get("/random", verify, async (request, response) => {
  const type = request.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    response.status(200).json(movie);
  } catch (err) {
    response.status(500).json(err);
  }
});

//DELETE LIST
router.delete("/delete", verify, async (request, response) => {
  List.findByIdAndDelete(request.params.id);
});
module.exports = router;
