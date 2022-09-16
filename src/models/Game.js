const mongoose = require("mongoose");

const Games = mongoose.model("Game", {
  title: String,
  bannerURL: String,
  ads: Number,
});

module.exports = Games;
