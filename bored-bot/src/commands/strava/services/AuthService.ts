import * as querystring from 'querystring'

import Debug from 'debug'
import UserDao from '../db/UserDao'
import config from '../config'
import {fetchAccessToken} from '../strava/accessToken'

const debug = Debug('strava:auth')
const userDao = new UserDao()

const urlRoot = () => config.hostname + config.basePath

/**
 * Create the URL that a user can use to connect the bot to their strava account
 * 
 * @param discordId User's ID
 */
export const getConnectUrl = async (discordId: string) => {
  debug(`authorizing new user`)
  let user = await userDao.findByDiscordId(discordId)

  if (!user) {
    user = await userDao.createNewUser(discordId, generateToken())
  }
  const tokenParams = querystring.stringify({
    token: discordId + "." + user.authToken
  })
  return `${urlRoot()}/auth?${tokenParams}`
}


/**
 * Create the URL for strava login
 * 
 * @param client_id OAuth client_id
 * @param redirect_uri Redirect URL for the strava authorization callback
 * @param state OAuth state to
 */
export const getAuthorizationUrl = (client_id: string, redirect_uri: string, state: string) => {
  const authParams = querystring.stringify({
    response_type: 'code',
    scope: 'read,activity:read,profile:read_all',
    approval_prompt: 'force',
    client_id,
    redirect_uri,
    state
  })

  return `http://www.strava.com/oauth/authorize?${authParams}`
}


/**
 * Accepts a refresh token
 * 
 * @param authString discordId.token string used to persist connection
 * @param code refresh code from strava API
 */
export const acceptToken = async (authString: string, code: string) => {
  const [discordId, token] = authString.split(".")
  const user = await userDao.findByDiscordId(discordId)
  
  if (!user) throw "User doesn't exist"
  if (user.authToken !== token) throw "Token does not match"

  const result = await fetchAccessToken(code)

  user.refreshToken = result.refresh_token;
  user.stravaId = result.athlete.id;
  
  await userDao.saveUser(user)
}


/**
 * Creates a random 32 character string
 */
export const generateToken = () => 
  [...Array(32)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
