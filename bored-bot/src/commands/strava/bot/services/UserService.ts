import {ResolveHandler} from 'bastion'
import UserDao from '../../db/UserDao'

const userDao = new UserDao()

export const withUserProp: ResolveHandler = async ({props, reply, user, command, next}) => {
  const stravaUser = await userDao.findByDiscordId(user.id);

  if (!stravaUser) {
    return reply(`User ${user.nickname} hasn't authorized with the bot yet! Use \`!${command} auth\` to get started`)
  }

  props.set("user", stravaUser);
  next()
}