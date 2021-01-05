require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Server is up and running.");
});

app.listen(PORT, () => {
  console.log("started at port 3000..");
});