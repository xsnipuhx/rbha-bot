import Debug from 'debug'
import {MissingResourceError} from '../utils/errors'
import User from './User'
import { createRandomToken } from '../services/AuthService'
// todo: from 'bastion-mongodb'
import mongodb from '../../../plugins/bastion-mongodb'

const getCollection = mongodb.collection('fit-users')
const debug = Debug('strava:user.dao')

export default class UserDao {

  /**
   * Find a user's profile information, if doesn't exist then initializes one with a random url token
   * 
   * @param discordId User ID from discord
   */
  public async findOrCreate(discordId: string): Promise<User> {
    const user = await this.findByDiscordId(discordId)

    if (user) {
      debug(`Got user %O`, user)
      return user
    } else {
      return this.createNewUser(discordId)
    }
  }

  /**
   * Creates a new user and initiatess a new authToken
   * 
   * @param discordId User ID from discord
   */
  public async createNewUser(discordId: string) {
    debug(`Created new user ${discordId}`)

    const user = User.from({
      discordId,
      authToken: createRandomToken()
    });
    
    await getCollection()
      .insertOne(user.json())
    
    return user
  }

  /**
   * Find a user by their discord ID
   * 
   * @param discordId User ID
   */
  public async findByDiscordId(discordId: string): Promise<User|null> {
    debug(`Finding user with id ${discordId}`)

    const result = await getCollection()
      .findOne({ discordId })
  
    if (!result) return null

    return User.from(result)
  }

  public async saveUser(user: User): Promise<User> {
    debug(`Saving user ${user.discordId} %O`, user.json())
    
    user.validate()
    
    await getCollection()
      .replaceOne(
        { discordId: user.discordId },
        user.json()
      )
      
    return user;
  }

}