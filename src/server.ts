import express from "express";
import convertHourStringToMinutes from "./utils/convertHourStringToMinutes"
import convertMinutesToHourString from "./utils/convertMinutesToHourString"
const Ads = require("./models/Ad.js")
const Games = require("./models/Game.js")
const mongoose = require("mongoose")
const dotenv = require("dotenv/config")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cors())

app.get("/games", async (req,res) => {
  try{
    const games = await Games.find()
    res.status(200).json(games)
    return
  }catch{
    res.status(500).json("Error")
    return
  }
})

app.post("/games", async (req,res) => {
  const body: any = req.body

  const game = await Games.create({
    title: body.title,
    bannerURL: body.bannerURL,
    ads: 0
  })

  res.status(201).json(game)
  return
})

app.post("/games/:id/ads", async (req,res) => {
  const gameId = req.params.id
  const body: any = req.body

  const ad = await Ads.create({
    gameId: gameId,
    name: body.name,
    yearsPlaying: body.yearsPlaying,
    discord: body.discord,
    weekDays: body.weekDays,
    hourStart: convertHourStringToMinutes(body.hourStart),
    hourEnd: convertHourStringToMinutes(body.hourEnd),
    useVoiceChannel: body.useVoiceChannel,
    createdAt: Date.now()
  })

  const game = await Games.findOne({_id: gameId})
  await Games.updateOne({_id: gameId}, {
    ads: game.ads + 1,
  })

  res.status(201).json(ad)
  return
})

interface adProps {
  _id: String,
  gameId: String,
  name: String,
  discord: String,
  yearsPlaying: Number,
  weekDays: Array<number>,
  hourStart: number,
  hourEnd: number,
  useVoiceChannel: boolean,
  createdAt: Date
}

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id
  try{
    const ads = await Ads.find({gameId}).sort({createdAt: 'desc'})
    
    res.status(200).json(ads.map((ad: adProps) => {
      return {
        _id: ad._id,
        gameId: ad.gameId,
        name: ad.name,
        yearsPlaying: ad.yearsPlaying,
        weekDays: ad.weekDays,
        hourStart: convertMinutesToHourString(ad.hourStart),
        hourEnd: convertMinutesToHourString(ad.hourEnd),
        useVoiceChannel: ad.useVoiceChannel,
        createdAt: ad.createdAt,
      }
    }));
    return
  }catch{
    res.status(500).json("error");
    return
  }
});

app.get("/ads/:id/discord", async (req, res) => {
  const adsId = req.params.id
  try{
    const ad = await Ads.findOne({_id: adsId})
    res.status(200).json({discord: ad.discord});
    return
  }catch{
    res.status(500).json("error");
    return
  }
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to database!")

  app.listen(3000, () => {
    console.log("App listening on port 3000!");
  });
}).catch((err: string) => {
  console.error("Error on database connection:\n" + err)
})

