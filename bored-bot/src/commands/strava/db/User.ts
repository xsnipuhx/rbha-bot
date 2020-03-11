import {InferType, number, object, string} from 'yup'
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import Debug from 'debug'
import Profile from './Profile'
import mongodb from '../../../plugins/bastion-mongodb'
import validatedModel from '../utils/validatedModel'

const debug = Debug('strava:db-user')
const getCollection = mongodb.collection('fit-users')

// Model Schema
const userSchema = object({
  discordId: string()
    .required(),

  authToken: string()
    .notRequired(),

  stravaId: number()
    .notRequired(),

  refreshToken: string()
    .notRequired()
    .default(""),

  profile: object()
    .model(Profile)
    .notRequired()
})

const Validator = validatedModel(userSchema)

@Serializable()
class UserModel extends Validator implements InferType<typeof userSchema> {
  /** Discord ID for this user */
  @JsonProperty()
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
  profile: Profile = new Profile();
}

export default class User extends UserModel {
  /**
   * Save the user to the DB
   * 
   */
  
  public async save(): Promise<User> {
    debug(`Saving user ${this.discordId} %O`, this.json())
    
    this.validate()
    
    return getCollection()
      .replaceOne(
        { discordId: this.discordId },
        this.json()
      )
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

    const user = User.from({ discordId });
    
    return getCollection()
      .insertOne(user.json())
      .then(() => user)
  }  

  /**
   * Find a user by their discord or strava IDs
   * 
   * @param query 
   */

  public static async findById(query: {discordId?: string, stravaId?: string}): Promise<User> {
    debug(`Finding user with id ${query}`);
    
    return getCollection()
      .findOne(query)
      .then( result => {
        if (result) return User.from(result)
        else throw new Error(`No user found with that ID: ${query}`)
      })
  }
}