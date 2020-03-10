// Initialize some configs
import "./lib/dotenv"
import "./lib/wretch"
import "./lib/yup"

import Bastion from 'bastion'
import BastionMongoDB from './plugins/bastion-mongodb'
import BastionExpress from './plugins/bastion-express'
import Strava from './commands/strava'

const bot = new Bastion({
  token: process.env.DISCORD_TOKEN!
})

const mongoPlugin = new BastionMongoDB({
  url: process.env.MONGO_URL!,
  db: process.env.MONGO_DB!
})

const expressPlugin = new BastionExpress()

bot.plugins([
  mongoPlugin,
  expressPlugin
])

bot.use("ping", ({reply}) => reply("Pong!"))

const strava = Strava({
  hostname: process.env.HOSTNAME!,
  basePath: "/strava",
  client_id: process.env.STRAVA_CLIENT_ID!,
  client_secret: process.env.STRAVA_CLIENT_SECRET!
})

expressPlugin.use("/strava", strava.web)
bot.use("fit", strava.command)

bot.connect()