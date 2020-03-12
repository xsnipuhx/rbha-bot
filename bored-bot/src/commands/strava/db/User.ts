import {IsDefined, ValidateNested, validateSync} from 'class-validator'
import {JsonProperty, Serializable, deserialize, serialize} from 'typescript-json-serializer';

import Debug from 'debug'
import Profile from './Profile'
import mongodb from '../../../plugins/bastion-mongodb'

const debug = Debug('strava:db-user')
const getCollection = mongodb.collection('fit-users')

@Serializable()
export default class User {
  /** Discord ID for this user */
  @JsonProperty()
  @IsDefined()
  discordId: string;

  /** Strava profile ID */
  @JsonProperty()
  stravaId: number;  

  /** Randomly generated token used as an URL password for users to access custom settings */
  @JsonProperty()
  authToken: string;

  /** Strava OAuth refresh code, used to obtain an access code for API Authorization */
  @JsonProperty()
  refreshToken: string;

  /** Profile status such as points, levels, etc */
  @JsonProperty()
  @ValidateNested()
  profile: Profile = new Profile();

  /**
   * Save the user to the DB
   * 
   */
  
  public async save(): Promise<User> {
    const json = serialize(this)
    debug(`Saving user ${this.discordId} %O`, json)

    const errors = validateSync(this);

    if (errors.length) {
      throw new Error('Could not validate model before saving')
    }
    
    return getCollection()
      .replaceOne({discordId: this.discordId}, json)
      .then(() => this)
  }

  /**
   * Creates a new user and initiatess a new authToken
   * 
   * @param discordId User ID from discord
   * @param authToken Generate a random auth token
   */

  public static async create(discordId: string) {
    debug(`Create new user ${discordId}`)

    const user = new User()
    user.discordId = discordId
    
    return getCollection()
      .insertOne(serialize(user))
      .then(() => user)
  }  

  /**
   * Find a user by their discord or strava IDs
   * 
   * @param query 
   */

  public static async find(query: {discordId?: string, stravaId?: string}): Promise<User> {
    debug(`Finding user with id %O`, query);
    
    return getCollection()
      .findOne(query)
      .then( result => {
        if (result) return deserialize(result, User);
        else throw new Error(`No user found with that ID: ${query}`);
      })
  }
}