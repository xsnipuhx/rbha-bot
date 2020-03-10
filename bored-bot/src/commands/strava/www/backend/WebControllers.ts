import * as AuthService from '../../services/AuthService'
import * as express from 'express'

import {createActivityEmbed, getActivityDetails} from '../../strava/activityEmbed'

import Bastion from 'bastion'
import Debug from 'debug'
import {Unauthorized} from './Errors'
import config from '../../config'

const debug = Debug("strava:webController")

/**
 * Accepts an Oauth access code 
 */
export const acceptStravaCode: express.RequestHandler = async function(req, res, next) {
  const authString = req.body.token
  const code = req.body.code

  try {
    await AuthService.acceptToken(authString, code)
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

  console.log(activity)
  const embed = createActivityEmbed(discordUser.username, athlete, activity)

  debug("Send embed")
  bastion.channel(config.postActivityChannel)
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