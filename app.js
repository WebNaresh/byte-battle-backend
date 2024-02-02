const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routes/userRoute");
const foodItem = require("./routes/foodItem");
const notification = require("./routes/notification");
const error = require("./utils/error");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// import routes
app.use("/route", user);
app.use("/route", foodItem);
app.use("/route", notification);
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});
app.use(error);
module.exports = app;
// npm i express cookie-parser body-parser bcryptjs
