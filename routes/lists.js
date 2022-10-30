const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//CREATE
// router.post("/", verify, (request, response) => {
//   if (request.user.isAdmin) {
//     const newList = new List(request.body);
//     if (newList) {
//       newList.save();
//       response.status(200).json(newList);
//     } else {
//       response.status(404).json("error in if/else");
//     }
//   } else {
//     response.status(403).json("not authorized");
//   }
// });

//CREATE 2
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE LIST
router.delete("/:id", verify, async (request, response) => {
  if (request.user.isAdmin) {
    try {
      await List.findByIdAndDelete(request.params.id);
      response.status(201).json("Succesfully deleted!");
    } catch (err) {
      response.status(404).json("err=", err);
    }
  } else {
    response.status(403).json("not authorized to delete");
  }
});

//GET

router.get("/", verify, async (request, response) => {
  const typeQuery = request.query.type;
  const genreQuery = request.query.genre;
  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        listEntires = List.find();
        list = await List.aggregate([{ $match: { type: typeQuery } }]);
      } else {
        list = await List.aggregate([{ $match: { type: typeQuery } }]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }

    response.status(200).json(list);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;
