require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
const PORT = 3000;
const quickList = ["Do something", "Do something else"];
const persList = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// ROOT ROUTE
app.get("/", (req, res) => {
  let listTitle = "Quick List";
  res.render("list", {
    date: date.getDate(),
    listTitle: listTitle,
    list: quickList
  });
});
app.post("/", (req, res) => {
  if(req.body.list === "Personal"){
    persList.push(req.body.newItem);
    res.redirect("/Personal");
  }else{
    quickList.push(req.body.newItem);
    res.redirect("/");
  }
});

// PERSONAL LIST ROUTE
app.get("/Personal", (req, res) => {
  let listTitle = "Personal List";
  res.render("list", {
    date: date.getDate(),
    listTitle: listTitle,
    list: persList
  });
});

app.listen(PORT, () => {
  console.log("started at port 3000..");
});