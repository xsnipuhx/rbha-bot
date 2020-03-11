import * as AuthService from '../../services/auth-service'
import * as express from 'express'

import Bastion, {Embed} from 'bastion'

import Debug from 'debug'
import {Unauthorized} from './Errors'
import config from '../../config'
import {getActivityDetails} from '../../strava/activityEmbed'

const debug = Debug("strava:webController")

/**
 * Accepts an Oauth access code and returns a JWT for future requestss
 * 
 * POST /auth/accept
 * @body `token` discordId.authToken string
 * @body `code` refresh code handed from strava
 */

export const acceptStravaCode: express.RequestHandler = async function(req, res, next) {
  const [discordId, authToken] = req.body.token.split(".")
  const code = req.body.code

  try {
    const hasAccess = await AuthService.authenticate(discordId, authToken)
    if (!hasAccess) throw new Error("Unauthorized")
    
    await AuthService.acceptToken(discordId, code)
    
    res.json({ accepted: true })
  } catch (e) {
    console.log(e)
    Unauthorized(res, "Unable to authenticate Token (Token may have been expired)");
  }
}

/**
 * Redirects to strava's OAuth authorization page
 */

export const redirectStravaAuth: express.RequestHandler = async function(req, res) {
  const auth_str = req.query.token
  const hostname = config.hostname
  const redirect = hostname + config.basePath + '/#accept'

  const url = AuthService.getAuthorizationUrl(
    config.client_id, 
    redirect, 
    auth_str
  )
  
  res.redirect(url)
}

/**
 * Gets called when a user authed with the app posts a new activity.
 * This controller will post an embed to the proper discord channel
 */

export const postActivity: express.RequestHandler = async function(req, res) {
  const bastion = req["bastion"] as Bastion
  const { owner_id, object_id, aspect_type } = req.body

  // We only care for new events
  if (aspect_type !== "create") return;

  const {user, activity, athlete} = await getActivityDetails(owner_id, object_id)
  const discordUser = await bastion.client.fetchUser(user.discordId)

  // todo: Move to an embed class or something in the bot folder
  const embed = new Embed()
    .setColor("fc4c02")
    .setAuthor(
      discordUser.username + " posted a run", 
      athlete.profile
    )
    .setTitle(activity.name)
    .setDescription(activity.description)
    // .setThumbnail(athlete.profile)
    .addField(
      "Distance", 
      activity.distance.toMiles().toFixed(2) + "mi", 
      true
    )
    .addField(
      "Time", 
      activity.moving_time.hhmmss(), 
      true
    )
    .addField(
      "Pace", 
      activity.average_pace.hhmmss() + '/mi', 
      true
    )
    .addField(
      "Heart Rate", 
      Math.floor(activity.average_heartrate), 
      true
    )
    .addField(
      "Points", 
      `\`♥\` +4.5 \`♥♥\` +6.2`, 
      true
    )
    .setFooter(`From ${activity.device_name}`)

  bastion
    .channel(config.postActivityChannel)
    .send(embed)
  
  res.send('👍')
}

/**
 * Used for registering a webhook with strava. They send a GET request to validate it
 */

export const acceptWebhook: express.RequestHandler = async function(req, res) {
  const challenge = req.query["hub.challenge"]
  res.send({"hub.challenge": challenge})
}