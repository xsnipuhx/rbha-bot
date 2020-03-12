import Debug from 'debug'
import User from "../db/User";

const debug = Debug('strava:user-service')

/**
 * Either return an existing user, or create one if one doesn't exist yet
 * 
 * @param discordId Discord ID of user
 * @param token authToken to use if creating new user
 */

export async function findOrCreateUser(discordId: string) {
  debug(`find or create new user`)
  try {
    return User.find({discordId})
  } catch (e) {
    return User.create(discordId)
  }
}

export async function findUser(query: { stravaId?: string, discordId?: string }) {
  debug(`find user %O`, query)
  return User.find(query)
}