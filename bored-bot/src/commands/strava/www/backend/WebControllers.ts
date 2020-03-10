import * as AuthService from '../../services/AuthService'
import * as express from 'express'

import {Unauthorized} from './Errors'
import config from '../../config'

/**
 * Accepts an Oauth access code 
 */
export const acceptStravaCode: express.RequestHandler = async (req, res, next) => {
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
export const redirectStravaAuth: express.RequestHandler = async (req, res) => {
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