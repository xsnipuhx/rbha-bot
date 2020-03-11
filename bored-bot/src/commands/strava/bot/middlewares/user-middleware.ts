import {ResolveHandler} from 'bastion'
import User from '../../db/User'

/**
 * Fetches DB user
 * 
 * @prop user
 */

export const withUserProp: ResolveHandler = async ({props, reply, user, command, next}) => {
  const stravaUser = await User.findById({ discordId: user.id });

  if (!stravaUser) {
    return reply(`User ${user.nickname} hasn't authorized with the bot yet! Use \`!${command} auth\` to get started`)
  }

  props.set("user", stravaUser);
  next()
}