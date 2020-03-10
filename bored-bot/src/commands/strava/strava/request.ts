import wretch, { Wretcher } from 'wretch';

import Debug from 'debug';
import User from "../db/User";
import {getAccessToken} from './accessToken';

/**
 * Returns a function that builds a wretch instance ready with authorization.
 * Also handles if a 401 happens from a bad token, will retry the request with a new token
 * 
 * @param user User DB object
 */
export const request = (user: User) => wretch()
    .middlewares([
      authTokenMiddleware({ user })
    ])
    .url('https://www.strava.com/api/v3/')

/**
 * Middleware for wretch that will apply the auth token, and retry once if token is expired 
 * 
 * @param user User from DB
 */
const authTokenMiddleware = ({user}) => next => async (url, opts) => {
  let token = await getAccessToken(user)
  let options = mergeAuthHeader(opts, token)

  const response = await next(url, options)

  if (response.status !== 401) {
      return response
  }

  // If reauth is needed, renew the token
  token = await getAccessToken(user, true)
  options = mergeAuthHeader(opts, token)

  // Perform the request again with the updated options
  return next(url, options)
}

/**
 * Merges an original wretch options and adds in an authorization header
 * 
 * @param originalOptions Original options given by wretch
 * @param token The new Bearer token to replace it
 */
const mergeAuthHeader = (originalOptions: any, token: string) => ({
  ...originalOptions,
  headers: {
    ...(originalOptions.headers || {}),
    Authorization: 'Bearer ' + token
  }
})

export interface StravaRequester {
  (path: string): Wretcher;
}