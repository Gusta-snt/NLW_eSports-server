const mongoose = require("mongoose");

const Ads = mongoose.model("Ad", {
  gameId: String,
  name: String,
  yearsPlaying: Number,
  discord: String,
  weekDays: Array,
  hourStart: Number,
  hourEnd: Number,
  useVoiceChannel: Boolean,
  createdAt: Date,
});

module.exports = Ads;
