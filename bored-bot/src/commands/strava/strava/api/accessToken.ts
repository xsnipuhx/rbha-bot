import * as NodeCache from 'node-cache';

import Debug from 'debug';
import User from "../../db/User";
import config from '../../config'
import wretch from 'wretch';

const debug = Debug('strava:accessToken')

const tokenApi = wretch().url('https://www.strava.com/oauth/token')
const clientConfig = () => ({
  client_id: config.client_id,
  client_secret: config.client_secret
})

// Store access tokens in a cache for a short time for subsequent requests
const tokenCache = new NodeCache({
  // 20 minutes
  stdTTL: 60 * 20
})

/**
 * Get access token - will try to pull from cache first, if not then fetches from the oauth api
 * 
 * @param user User object from database
 * @param force? Force fetching a new token
 */

export async function getAccessToken(user: User, force = false) {
  const token = tokenCache.get<string>(user.discordId)
  if (token && !force) return token

  const result = await refreshAccessToken(user.refreshToken)

  tokenCache.set(
    user.discordId, 
    result.access_token
  );

  return result.access_token
}

/**
 * Fetch an access token for the first time
 * 
 * @param refreshToken Refresh code from OAuth grant flow
 */

export async function fetchAccessToken(refreshToken: string) {
  debug(`fetching new access token`)
  
  return tokenApi
    .post({
      ...(clientConfig()),
      code        : refreshToken,
      grant_type  : "authorization_code"
    })
    .json<TokenResponse>()
}

/**
 * Gain a user's new access token for strava requests
 * 
 * @param refreshToken Refresh code from OAuth grant flow
 */

async function refreshAccessToken(refreshToken: string) {
  debug(`refreshing access token`)
  
  return tokenApi
    .post({
      ...(clientConfig()),
      refresh_token : refreshToken,
      grant_type    : "refresh_token"
    })
    .json<TokenResponse>()
}

type TokenResponse = {
  /** Longer term refresh token. Use this to get a new access token */
  refresh_token: string;
  /** Access token to hit the API */
  access_token: string;
  /** Strava profile information */
  athlete: { id: number; }
}