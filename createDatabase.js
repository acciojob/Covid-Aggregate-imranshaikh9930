const mongoose = require("mongoose");
const { CovidTally }  = require("./connector");
const { data } = require("./data");

const refreshAll = async () => {
  await CovidTally.deleteMany({});
  await CovidTally.insertMany(data);
  console.log("done!");
  mongoose.disconnect();
};
refreshAll();
