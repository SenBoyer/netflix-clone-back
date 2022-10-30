const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("../api/routes/auth");
const userRoute = require("../api/routes/users");
const movieRoute = require("../api/routes/movies");
const listRoute = require("../api/routes/lists");
const featuredRoute = require("../api/routes/featured");
const cors = require("cors");

app.use(cors());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connection succesfull"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api/featured", featuredRoute);

app.listen(8080, () => {
  console.log("backend server is running");
});
