import {getAccessToken} from './accessToken';

/**
 * Middleware for wretch that will apply the auth token, and retry once if token is expired 
 * 
 * @param user User from DB
 */

export const authTokenMiddleware = ({user}) => next => async (url, opts) => {
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