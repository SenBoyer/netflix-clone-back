const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");

//REGISTER
router.post("/register", async (request, response) => {
  const newUser = new User({
    username: request.body.username,
    email: request.body.email,
    password: CryptoJS.AES.encrypt(
      request.body.password,
      process.env.ENCRYPT_KEY
    ).toString(),
  });

  try {
    const user = await newUser.save();
    response.status(201).json(user);
  } catch (err) {
    response.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    !user && response.status(401).json("Wrong password or email!");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.ENCRYPT_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== request.body.password &&
      response.status(401).json("wrong password");

    const access_token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.ENCRYPT_KEY,
      { expiresIn: "5d" }
    );
    console.log("access_token=", access_token);
    // ----SEPERATING PASSWORD OUT FROM RESPONSE-----
    const { password, ...info } = user._doc;
    response.status(200).json({ ...info, access_token });
    // ----------------------------------------------
  } catch {
    (error) => response.status(500).json(error);
  }
});

//DELETE

// router.delete("/:id", async (request, response) => {
//   console.log("DELETE REQUEST RUNNING");
//   if (request.user.id === request.params.id || request.user.isAdmin) {
//     if (request.body.password) {
//       request.body.password = CryptoJS.AES.encrypt(
//         request.body.password,
//         process.env.SECRET_KEY
//       ).toString();
//     }

//     try {
//       console.log("DELETE REQUEST TRY RUNNING");
//       let userID = request.params.id;
//       console.log("userID=  ", userID);
//       console.log("db.users before =", db.users);
//       db.users.deleteOne({ id: userID });
//       console.log("db.users after =", db.users);
//     } catch (err) {
//       response.status(500).json(err);
//     }
//   } else {
//     response.status(403).json("You can update only your account!");
//   }
// });

module.exports = router;
