const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const verify = require("../verifyToken");

// UPDATE

router.put("/:id", verify, async (request, response) => {
  if (request.user.id === request.params.id || request.user.isAdmin) {
    if (request.body.password) {
      request.body.password = CryptoJS.AES.encrypt(
        request.body.password,
        process.env.ENCRYPT_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(request.params.id, {
        $set: request.body,
      });

      response.status(200).json(updatedUser);
    } catch (err) {
      response.status(500).json(err);
    }
  }
});

//DELETE
router.delete("/:id", verify, async (request, response) => {
  if (request.user.id === request.params.id || request.user.isAdmin) {
    try {
      User.findByIdAndRemove(request.params.id, (err, user) => {
        if (!err) {
          response.status(200).json(`deleted ${user}`);
        } else {
          response.status(403).json("error in try");
        }
      });
    } catch {
      response.status(401).json("error error error in catch");
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

//GET

// find by id
router.get("/find/:id", async (request, response) => {
  try {
    User.findById(request.params.id, (err, user) => {
      if (!err) {
        response.status(200).json(user);
      } else {
        response.status(403).json("could not find");
      }
    });
  } catch {
    response.status(401).json("error error error in catch");
  }
});

//find
// router.get("/find/:id", async (request, response) => {
//   try {
//     User.find({ _id: request.params.id }, (err, user) => {
//       if (!err) {
//         response.status(200).json(user[0]);
//       } else {
//         response.status(404).json("could not find");
//       }
//     });
//   } catch {
//     response.status(401).json("401");
//   }
// });

//GET ALL
router.get("/find/:id", async (request, response) => {
  query = request.query.new;
  if (request.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find();
      response.status(200).json(users);
    } catch (error) {
      response.status(403).json("catch error", err);
    }
  }
  response.status(403).json("you don't have authority!");
});

module.exports = router;
