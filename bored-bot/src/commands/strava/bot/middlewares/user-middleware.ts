import {ResolveHandler} from 'bastion'
import User from '../../db/User'

/**
 * Fetches DB user
 * 
 * @prop user
 */

export const withUserProp: ResolveHandler = async ({props, reply, member, command, next}) => {
  const user = await User.find({ discordId: member.id });

  if (!user) {
    return reply(`User ${member.nickname} hasn't authorized with the bot yet! Use \`!${command} auth\` to get started`)
  }

  props.set("user", user);
  next()
}