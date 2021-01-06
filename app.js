require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");

const PORT = 3000;
const app = express();
const today = new Date();
var items = ["Do something", "Do something else"];

var options = {
  month: "long",
  day: "numeric",
  weekday: "short",
  // year: "numeric",
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  var date = today.toLocaleDateString("en-US", options); 
  res.render("list", {
    date: date,
    item: items
  });
});

app.post("/", (req, res) => {
  items.push(req.body.newItem);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("started at port 3000..");
});