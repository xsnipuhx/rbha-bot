import Bastion from 'bastion'
import config from '../config'
import {getAuthorizationUrl, acceptToken} from '../services/auth.service'

export const accept = async (req, res) => {
  const authString = req.query.state
  const code = req.query.code

  try {
    await acceptToken(authString, code)
    res.redirect(config.basePath)
  } catch (e) {
    res.status(401)
      .send("Unable to authenticate Token (Token may have been expired)")
  }
}

export const redirectStravaAuth = async (req, res) => {
  const auth_str = req.query.auth
  const hostname = (req.bastion as Bastion).web.hostname
  const redirect = hostname + config.basePath + '/auth/accept'

  const url = getAuthorizationUrl(config.client_id, redirect, auth_str)
  res.redirect(url)
}