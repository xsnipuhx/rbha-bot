import Debug from 'debug'
import User from './User'
// todo: from 'bastion-mongodb'
import mongodb from '../../../plugins/bastion-mongodb'

const getCollection = mongodb.collection('fit-users')
const debug = Debug('strava:user.dao')

export default class UserDao {

  /**
   * Creates a new user and initiatess a new authToken
   * 
   * @param discordId User ID from discord
   * @param authToken Generate a random auth token
   */
  public async createNewUser(discordId: string, authToken: string) {
    debug(`Created new user ${discordId}`)

    const user = User.from({ 
      discordId,
      authToken 
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


  /**
   * Find a user by their strava ID
   * 
   * @param discordId User ID
   */
  public async findByStravaId(stravaId: string): Promise<User|null> {
    debug(`Finding user with strava id ${stravaId}`)

    const result = await getCollection()
      .findOne({ stravaId })
  
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