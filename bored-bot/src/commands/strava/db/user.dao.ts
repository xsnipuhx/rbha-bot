import User from './user.model'
import { createRandomToken } from '../services/auth.service'
import Debug from 'debug'
// todo: from 'bastion-mongodb'
import mongodb from '../../../plugins/bastion-mongodb'

const collection = mongodb.collection('fit-users')
const debug = Debug('strava:user.dao')

export default class UserDao {

  public async findOrCreate(discordId: string): Promise<User> {
    let user = await this.findByDiscordId(discordId)

    if (user) {
      debug(`Got user %O`, user)
      return user
    } else {
      user = new User({
        discordId,
        urlToken: createRandomToken()
      });
      return user
    }
  }

  public async findByDiscordId(discordId: string): Promise<User> {
    debug(`Finding user with id ${discordId}`)

    const result = await collection()
      .findOne({ discordId })

    return new User(result)
  }

}