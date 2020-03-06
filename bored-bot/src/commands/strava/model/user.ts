import User, {UserDocument} from './user.schema'
import { createRandomToken } from '../services/auth.service'

/**
 * @param discordId
 */
export const findOrCreate = async (discordId: string): Promise<UserDocument> => {
  let user = await findByDiscordId(discordId)

  if (user) return user
  
  user = new User({
    discordId,
    url_token: createRandomToken()
  })

  return user.save()
}

/**
 * 
 * @param discordId 
 */
export const findByDiscordId = (discordId: string): Promise<UserDocument> =>
  User
    .findOne({ discordId })
    .exec()