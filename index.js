const express = require("express");
const app = express();
const { CovidTally } = require("./connector");
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("HELLO WORLD");
});

// your code goes here


module.exports = app;
