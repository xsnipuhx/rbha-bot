import * as AuthService from '../../services/auth-service'
import * as StravaService from '../../services/strava-service'
import * as express from 'express'

import Bastion, {Embed} from 'bastion'

import Debug from 'debug'
import activityEmbed from '../../bot/embeds/activity-embed'
import config from '../../config'
import {findUser} from '../../services/user-service'

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
  } catch (err) {
    debug('failed to authorize: %O', err)
    res.status(401)
      .json({ error: "Unable to authenticate Token (Token may have been expired)" })
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
  debug('postActivity(%O)', req.body)

  const bastion = req["bastion"] as Bastion
  const { owner_id, object_id, aspect_type } = req.body

  // We only care for new events
  if (aspect_type !== "create") return;

  debug('fetching data')
  const user = await findUser({ stravaId: owner_id })
  debug('user? %O', user.json())
  const [athlete, activity, discordUser] = await Promise.all([
    StravaService.getProfile(user),
    StravaService.getActivityDetails(user, object_id),
    bastion.client.fetchUser(user.discordId)
  ])

  debug('creating embed')
  const embed = activityEmbed(
    discordUser.username, 
    athlete.profile, 
    activity
  );

  debug('sending to channel')
  bastion
    .channel(config.postActivityChannel)
    .send(embed)
  
  debug('👍')
  res.send('👍')
}

/**
 * Used for registering a webhook with strava. They send a GET request to validate it
 */

export const acceptWebhook: express.RequestHandler = async function(req, res) {
  const challenge = req.query["hub.challenge"]
  res.send({"hub.challenge": challenge})
}