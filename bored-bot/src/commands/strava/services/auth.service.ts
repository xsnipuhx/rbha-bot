import {ResolveHandler} from 'bastion'
import config from '../config'
import UserDao from '../db/user.dao'
import Debug from 'debug'

const debug = Debug('strava:auth')
const userDao = new UserDao()

/**
 * Create the URL that a user can use to connect the bot to their strava account
 * @param discordId The URL to give to users to authorize
 */
export const getConnectUrl = async (discordId: string) => {
  debug(`authorizing new user`)
  const user = await userDao.findOrCreate(discordId)
  return `${config.hostname}${config.basePath}?auth=${discordId}.${user.urlToken}`
}


/**
 * Create the URL for strava login
 * @param redirect_url Redirect URL for the strava authorization callback
 * @param state OAuth state to
 */
export const getAuthorizationUrl = (client_id: string, redirect_url: string, state: string) => 
  `http://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_url}&approval_prompt=force&scope=read&state=${state}`


/**
 * Accepts a refresh token
 * @param authString discordId.token string used to persist connection
 * @param code refresh code from strava API
 */
export const acceptToken = async (authString: string, code: string) => {
  const [discordId, token] = authString.split(".")
  const user = await userDao.findByDiscordId(discordId)
  if (user.urlToken !== token) throw "Token does not match"

  // await user.acceptToken(code)
}


/**
 * Creates a random 32 character string
 */
export const createRandomToken = () => 
  [...Array(32)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
